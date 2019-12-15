import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError } from '@utils';
import { Organization } from '@models';

export const organizationResolver = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
    id: number
) => {
    try {
        res;
        const organization = await Organization.findByPk(id);
        if (!organization) {
            return next(notFoundError('Organization'));
        }
        req.organization = organization;
        return next();
    } catch (err) {
        return next(err);
    }
};
