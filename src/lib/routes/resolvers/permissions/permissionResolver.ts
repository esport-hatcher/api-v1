import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError } from '@utils';
import { Permission, Role, Action } from '@models';

export const permissionResolver = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
    id: number
) => {
    try {
        res;
        const permission = await Permission.findByPk(id, {
            include: [Role, Action],
        });
        if (!permission) {
            return next(notFoundError('Permission'));
        }
        req.permission = permission;
        return next();
    } catch (err) {
        return next(err);
    }
};
