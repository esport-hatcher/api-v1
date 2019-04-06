import { Response, NextFunction } from 'express';
import * as jwt from 'jwt-simple';
import * as keys from '../keys';
import requestType from '../typings/requestType';
import userType from '../typings/userType';
import userFactory from '../factories/userFactory';

const tokenForUser = (user: any) => {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtSecret);
};

export const register = async (
	req: requestType,
	res: Response,
	next: NextFunction
) => {
	try {
		const user: userType = await userFactory.create(req.body);
		if (!user) {
			const error: any = new Error('User already exist');
			error.statusCode = 422;
			return next(error);
		}
		return res.status(201).json({ token: tokenForUser(user) });
	} catch (err) {
		return next(err);
	}
};
