import { Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import { omit } from 'lodash';
import { IRequest } from '@typings';
import { User } from '@models';
import {
    logRequest,
    notFoundError,
    unauthorizedError,
    conflictError,
    unprocessableEntity,
} from '@utils';
import { ModelController } from '@controllers';
import { FORBIDDEN_FIELDS } from '@config';
import { validationResult } from 'express-validator/check';

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
                .json(
                    omit(req.owner.get({ plain: true }), ...FORBIDDEN_FIELDS)
                );
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
            user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
            user.country = req.body.country || user.country;
            user.city = req.body.city || user.city;
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
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
    async joinTeam(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { owner, team } = req;
            const { role } = req.body;

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
                        role: role,
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
    async quitTeam(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { owner, team } = req;

            /**
             * Check if the team the user wants to quit exists
             */
            if (!team) {
                return next(unprocessableEntity('Team does not exist'));
            }
            const teamUsers = await team.getUsers();
            const userInTeam = teamUsers.find(
                userTeam => userTeam.id === owner.id
            );
            /**
             * Check if the user is in the team he wants to quit
             */
            if (!userInTeam) {
                return next(unprocessableEntity("User isn't in that team"));
            }
            /**
             * If the user is in the team he wants to quit, quit it
             */
            await userInTeam.TeamUser.destroy();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }
    async getUserTeam(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { user } = req;
            const userTeams = await user.getTeams();
            return res.status(200).json(userTeams);
        } catch (err) {
            return next(err);
        }
    }
}

export const userController = new UserController();
