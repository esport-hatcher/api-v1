import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { omit, fromPairs, map } from 'lodash';
import { Op } from 'sequelize';

const CONFIG_FIELDS = ['page', 'count'];

export const requireFiltersOrPagination = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const page = Number(req.query.page) || 1;
    const count = Boolean(req.query.count) || false;
    const queryFilters = omit(req.query, ...CONFIG_FIELDS);

    const filtersArray = Object.entries(queryFilters).map(([key, value]) => {
        return {
            key,
            operator: { [Op.like]: `${value}%` },
        };
    });
    const filters = fromPairs(map(filtersArray, i => [i.key, i.operator]));

    req.filters = filters;
    req.pagination = page;
    req.count = count;
    return next();
};
