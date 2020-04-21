import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError } from '@utils';
import { Action } from '@models';

export const actionResolver = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
    id: number
) => {
    try {
        res;
        const action = await Action.findByPk(id);
        if (!action) {
            return next(notFoundError('Action'));
        }
        req.action = action;
        return next();
    } catch (err) {
        return next(err);
    }
};
