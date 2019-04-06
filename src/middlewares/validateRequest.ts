import { validationResult } from 'express-validator/check';
import requestType from '../typings/requestType';
import { Response, NextFunction } from 'express';

// Use express validator to check if all rules are passing, redirecting to error handler otherwise

export default (req: requestType, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	res;
	if (!errors.isEmpty()) {
		const error: any = new Error('Validation failed');
		error.statusCode = 422;
		error.data = errors.array();
		return next(error);
	}
	next();
};
