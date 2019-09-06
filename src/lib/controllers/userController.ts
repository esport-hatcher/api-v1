import { Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import IRequest from '@typings/general/IRequest';
import userFactory from '@factories/userFactory';
import User from '@models/User';
import { logRequest } from '@utils/decorators';
import { notFoundError, unauthorizedError, conflictError } from '@utils/errors';
import { ModelController } from '@controllers/ModelController';

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
            const user = await userFactory.create(req.body);
            return res.status(201).json({ token: user.getAccessToken() });
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
}

export default new UserController();
