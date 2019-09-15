import { Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import { omit } from 'lodash';
import { IRequest } from '@typings';
import { User, Team } from '@models';
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
                user: omit(user.get({ plain: true }), ...FORBIDDEN_FIELDS),
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
                user: omit(user.get({ plain: true }), ...FORBIDDEN_FIELDS),
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
            return res
                .status(200)
                .json(omit(req.user.get({ plain: true }), ...FORBIDDEN_FIELDS));
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
        const { userId } = req.params;

        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return next(notFoundError('User'));
            }
            user.username = req.body.username || user.username;
            user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
            user.country = req.body.country || user.country;
            user.city = req.body.city || user.city;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
            await user.save();
            return res.sendStatus(200);
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
            const { user } = req;
            const { teamId } = req.params;
            const { role } = req.body;

            const team = await Team.findByPk(teamId);
            if (!team) {
                return next(notFoundError('Team'));
            }
            const users = await team.getUsers();
            const userInTeam = users.find(userTeam => userTeam.id === user.id);
            if (!userInTeam) {
                team.addUser(user, {
                    through: {
                        role: role,
                        teamStatus: false,
                        playerStatus: true,
                    },
                });
                return res.sendStatus(201);
            }
            await userInTeam.TeamUser.update({ playerStatus: true });
            return res.sendStatus(201);
        } catch (err) {
            return next(err);
        }
    }
}

export const userController = new UserController();
