import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { omit, fromPairs, map } from 'lodash';
import { Op } from 'sequelize';

export const requireFiltersOrPagination = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const page = req.query.page || 1;
    const queryWithoutPage = omit(req.query, 'page');

    const filtersArray = Object.entries(queryWithoutPage).map(
        ([key, value]) => {
            return {
                key,
                operator: { [Op.like]: `${value}%` },
            };
        }
    );
    const filters = fromPairs(map(filtersArray, i => [i.key, i.operator]));

    req.filters = filters;
    req.pagination = page;
    return next();
};
