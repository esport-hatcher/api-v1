import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError, logger } from '@utils';
import { Event } from '@models';

export const eventResolver = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
    id: number
) => {
    try {
        res;
        const event = await Event.findByPk(id);
        if (!event) {
            logger('Resolver', `Event ${id} not found`);
            return next(notFoundError('Event'));
        }
        req.event = event;
        return next();
    } catch (err) {
        return next(err);
    }
};
