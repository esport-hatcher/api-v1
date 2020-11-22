import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError, logger } from '@utils';
import { Contact } from '@models';

export const contactResolver = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
    id: number
) => {
    try {
        res;
        const contact = await Contact.findByPk(id);
        if (!contact) {
            logger('Resolver', `Contact ${id} not found`);
            return next(notFoundError('Contact'));
        }
        req.contact = contact;
        return next();
    } catch (err) {
        return next(err);
    }
};
