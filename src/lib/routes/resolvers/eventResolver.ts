import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError } from '@utils';
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
            return next(notFoundError('Event'));
        }
        req.event = event;
        return next();
    } catch (err) {
        return next(err);
    }
};
