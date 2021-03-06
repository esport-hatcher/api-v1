import { Response, NextFunction } from 'express';
import { compare, hash } from 'bcryptjs';
import { omit } from 'lodash';
import { IRequest } from '@typings';
import { User } from '@models';
import {
    logRequest,
    notFoundError,
    unauthorizedError,
    conflictError,
} from '@utils';
import { ModelController } from '@controllers';
import { FORBIDDEN_FIELDS } from '@config';

class UserController extends ModelController<typeof User> {
    constructor() {
        super(User);
    }

    @logRequest
    async create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { email } = req.body;

            const conflictUser: User = await User.findOne({
                where: { email },
            });
            if (conflictUser) {
                return next(conflictError('User already exist'));
            }
            const user = await User.create(req.body);
            return res.status(201).json({
                token: user.getAccessToken(),
            });
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getToken(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(notFoundError('User'));
            }
            const equal = await compare(password, user.password);
            if (!equal) {
                return next(unauthorizedError('Invalid credentials'));
            }
            return res.status(200).json({
                token: user.getAccessToken(),
            });
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getMe(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { owner } = req;
            return res
                .status(200)
                .json(omit(owner.get({ plain: true }), ...FORBIDDEN_FIELDS));
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async updateById(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { user } = req;

        try {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
            user.country = req.body.country || user.country;
            user.city = req.body.city || user.city;
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
            user.twitchUsername =
                req.body.twitchUsername || user.twitchUsername;
            user.lolSummonerName =
                req.body.lolSummonerName || user.lolSummonerName;
            user.lolRegion = req.body.lolRegion || user.lolRegion;
            await user.save();
            return res
                .status(200)
                .json(omit(user.get({ plain: true }), 'password'));
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async checkIfEmailIsAvailable(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { email } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.sendStatus(200);
            }
            return next(conflictError());
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async userJoinTeam(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { owner, team } = req;

            const teamUsers = await team.getUsers();
            const userInTeam = teamUsers.find(
                userTeam => userTeam.id === owner.id
            );
            /**
             * Check if the team the user wants to join hadn't already invited him
             */
            if (!userInTeam) {
                team.addUser(owner, {
                    through: {
                        role: 'Player',
                        teamStatus: false,
                        playerStatus: true,
                    },
                });
                return res.sendStatus(201);
            }
            /**
             * If the team did invite him, it accept the invitation
             */
            await userInTeam.TeamUser.update({ playerStatus: true });
            return res.sendStatus(201);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async resetPassword(req: IRequest, res: Response, next: NextFunction) {
        try {
            const email: string = req.body.email;

            if (email == null) {
                return res.status(404).json({
                    success: false,
                    error: 'Missing argument',
                });
            }

            const user: User = await User.findOne({ where: { email } });

            if (user == null) {
                return res.status(404).json({
                    success: false,
                    error: 'No user found',
                });
            }

            // user.resetHash = Md5.hashStr(email);
            user.resetHash = await hash(email, 10);
            await user.save();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async changePassword(req: IRequest, res: Response, next: NextFunction) {
        try {
            const password = req.body.password;
            const comfirmPassword = req.body.comfirmPassword;
            const token = req.body.token;

            if (token == null) {
                return res.status(404).json({
                    success: false,
                    error: 'Missing argument',
                });
            }

            const user: User = await User.findOne({
                where: { resetHash: token },
            });

            if (user == null) {
                return res.status(404).json({
                    success: false,
                    error: 'Invalid token',
                });
            }

            if (token == user.resetHash && password == comfirmPassword) {
                const hashed = await hash(password, 10);
                user.password = hashed;
                user.resetHash = '';
                user.save;
            } else {
                if (user == null) {
                    return res.status(404).json({
                        success: false,
                        error: 'Invalid token',
                    });
                }
            }

            await user.save();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }
}

export const userController = new UserController();
