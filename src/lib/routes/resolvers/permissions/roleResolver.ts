import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError } from '@utils';
import { Role } from '@models';

export const roleResolver = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
    id: number
) => {
    try {
        res;
        const role = await Role.findByPk(id);
        if (!role) {
            return next(notFoundError('Role'));
        }
        req.role = role;
        return next();
    } catch (err) {
        return next(err);
    }
};
