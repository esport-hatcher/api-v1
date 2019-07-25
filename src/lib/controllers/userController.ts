import { Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import IRequest from '@typings/general/IRequest';
import userFactory from '@factories/userFactory';
import User from '@models/User';
import { pick } from 'lodash';
import { logRequest } from '@utils/decorators';
import { notFoundError, unauthorizedError, conflictError } from '@utils/errors';

class UserController {
    @logRequest
    async register(req: IRequest, res: Response, next: NextFunction) {
        try {
            const user = await userFactory.create(req.body);
            return res.status(201).json({ token: user.getAccessToken() });
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getToken(req: IRequest, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(notFoundError('User'));
        }
        const equal = await compare(password, user.password);
        if (!equal) {
            return next(unauthorizedError());
        }
        return res.status(200).json({ token: user.getAccessToken() });
    }

    @logRequest
    async findAll(
        // tslint:disable-next-line: variable-name
        req: IRequest,
        res: Response,
        next: NextFunction
    ) {
        let users: User[];
        try {
            if (req.query.page) {
                const { page } = req.query || 1;
                const perPage = 15;
                users = await User.findAll({
                    limit: perPage,
                    offset: (page - 1) * perPage,
                });
            } else {
                users = await User.findAll();
            }
            return res
                .status(200)
                .json(
                    users.map(user =>
                        pick(
                            user,
                            'id',
                            'username',
                            'email',
                            'avatarUrl',
                            'country',
                            'city',
                            'hashtag',
                            'phoneNumber',
                            'superAdmin',
                            'createdAt',
                            'updatedAt'
                        )
                    )
                );
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async findById(req: IRequest, res: Response, next: NextFunction) {
        const { userID } = req.params;

        try {
            const user = await User.findByPk(userID);

            if (!user) {
                return next(notFoundError('User'));
            }
            return res
                .status(200)
                .json(
                    pick(
                        user,
                        'id',
                        'username',
                        'email',
                        'avatarUrl',
                        'country',
                        'city',
                        'hashtag',
                        'phoneNumber',
                        'superAdmin',
                        'createdAt',
                        'updatedAt'
                    )
                );
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async updateById(req: IRequest, res: Response, next: NextFunction) {
        const { userID } = req.params;

        try {
            const user = await User.findByPk(userID);
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
    async deleteById(req: IRequest, res: Response, next: NextFunction) {
        const { userID } = req.params;

        try {
            const user = await User.findByPk(userID);
            if (!user) {
                return next(notFoundError('User'));
            }
            await user.destroy();
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
    ) {
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
}

export default new UserController();
