import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

export const requireOwnerPartOfEvent = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const { event, owner } = req;

    const eventBelongsToUser = await owner.getEvents({
        where: { id: event.id },
    });

    if (!eventBelongsToUser) {
        return next(unauthorizedError('Event does not belong to this user'));
    }
    return next();
};
