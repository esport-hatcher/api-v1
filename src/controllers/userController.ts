import { Response, NextFunction } from 'express';
import { encode } from 'jwt-simple';
import { jwtSecret } from '@config/keys';
import IRequest from '@typings/general/IRequest';
import userFactory from '@factories/userFactory';
import User from '@models/User';

const tokenForUser = (user: User) => {
    const timestamp = new Date().getTime();
    return encode({ sub: user.id, iat: timestamp }, jwtSecret);
};

export const register = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userFactory.create(req.body);
        return res.status(201).json({ token: tokenForUser(user) });
    } catch (err) {
        return next(err);
    }
};

export const getUserInfo = async (req: IRequest, res: Response) => {
    return res.status(200).json({ name: req.user.username });
};
