import { Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import IRequest from '@typings/general/IRequest';
import userFactory from '@factories/userFactory';
import User from '@models/User';
import IError from '@typings/general/IError';
import { pick } from 'lodash';
import { logRequest } from '@utils/decorators';

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
            const error: IError = new Error('Email not found');
            error.statusCode = 404;
            error.message = 'Email not found';
            return next(error);
        }
        const equal = await compare(password, user.password);
        if (!equal) {
            const error: IError = new Error('Bad credentials');
            error.statusCode = 401;
            error.message = 'Bad credentials';
            return next(error);
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
                const error: IError = new Error('User not found');
                error.statusCode = 404;
                error.message = 'User not found';
                return next(error);
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
                const error: IError = new Error('User not found');
                error.statusCode = 404;
                error.message = 'User not found';
                return next(error);
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
            const err: IError = new Error('email already taken');
            err.statusCode = 409;
            err.message = 'email already taken';
            return next(err);
        } catch (err) {
            return next(err);
        }
    }
}

export default new UserController();
