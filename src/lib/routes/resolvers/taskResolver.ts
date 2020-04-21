import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError, logger } from '@utils';
import { Task } from '@models';

export const taskResolver = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
    id: number
) => {
    try {
        res;
        const task = await Task.findByPk(id);
        if (!task) {
            logger('Resolver', `Task ${id} not found`);
            return next(notFoundError('Task'));
        }
        req.task = task;
        return next();
    } catch (err) {
        return next(err);
    }
};
