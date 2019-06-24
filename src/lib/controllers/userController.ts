import { Response, NextFunction } from 'express';
import { encode } from 'jwt-simple';
import { compare } from 'bcryptjs';
import { jwtSecret } from '@config/keys';
import IRequest from '@typings/general/IRequest';
import userFactory from '@factories/userFactory';
import User from '@models/User';
import IError from '@typings/general/IError';
import { logRequest } from '@utils/decorators';

const tokenForUser = (user: User) => {
    const timestamp = new Date().getTime();
    return encode({ sub: user.id, iat: timestamp }, jwtSecret);
};
class UserController {
    @logRequest
    async register(req: IRequest, res: Response, next: NextFunction) {
        try {
            const user = await userFactory.create(req.body);
            return res.status(201).json({ token: tokenForUser(user) });
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
        return res.status(200).json({ token: tokenForUser(user) });
    }

    @logRequest
    async findAll(
        // tslint:disable-next-line: variable-name
        _req: IRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const users = await User.findAll();
            return res.status(200).json(users);
        } catch (err) {
            return next(err);
        }
    }

    // export const updateUserInfo = async (
    //     req: IRequest,
    //     res: Response,
    //     next: NextFunction
    // ) => {

    // };

    @logRequest
    async findById(req: IRequest, res: Response, next: NextFunction) {
        const { userID } = req.params;

        try {
            const user = await User.findByPk(userID);
            return res.status(200).json(user);
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
                return res.status(200).json({ status: 'ok' });
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
