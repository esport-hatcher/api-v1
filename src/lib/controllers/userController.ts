import { Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import IRequest from '@typings/general/IRequest';
import userFactory from '@factories/userFactory';
import User from '@models/User';
import { pick, omit, fromPairs, map } from 'lodash';
import { logRequest } from '@utils/decorators';
import { notFoundError, unauthorizedError, conflictError } from '@utils/errors';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

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
        const page = req.query.page || 1;
        const PER_PAGE = 50;

        const queryWithoutPage = omit(req.query, 'page');
        const filtersArray = Object.entries(queryWithoutPage).map(
            ([key, value]) => {
                return {
                    key,
                    operator: { [Op.like]: `%${value}%` },
                };
            }
        );
        const filters = fromPairs(map(filtersArray, i => [i.key, i.operator]));
        try {
            users = await User.findAll({
                limit: PER_PAGE,
                offset: (page - 1) * PER_PAGE,
                where: filters,
            });
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
