import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

export const requirePersonalTask = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const { task, owner } = req;

    const taskBelongsToUser = await owner.getTasks({
        where: { id: task.id },
    });

    if (!taskBelongsToUser || task.TeamId) {
        return next(unauthorizedError('Task does not belong to this user'));
    }
    return next();
};
