import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logger } from '@utils';

export const handlePermissions = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    res.header.toString();
    logger('Permissions', 'Middleware running');
    logger('Permissions', req.originalUrl);
    return next();
};
