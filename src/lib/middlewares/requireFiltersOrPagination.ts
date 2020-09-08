import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { omit, fromPairs, map, pick } from 'lodash';
import { Op } from 'sequelize';

const CONFIG_FIELDS = ['page', 'count'];
const DATE_FIELDS = ['dateBegin', 'dateEnd'];

export const requireFiltersOrPagination = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const page = Number(req.query.page) || 1;
    const count = Boolean(req.query.count) || false;
    const dateFilters = pick(req.query, ...DATE_FIELDS);
    const queryFilters = omit(req.query, ...CONFIG_FIELDS, ...DATE_FIELDS);
    let dateFiltersQuery: undefined | object = undefined;

    if (dateFilters['dateBegin'] && dateFilters['dateEnd']) {
        dateFiltersQuery = {
            [Op.or]: [
                {
                    dateBegin: {
                        [Op.between]: [
                            dateFilters['dateBegin'],
                            dateFilters['dateEnd'],
                        ],
                    },
                },
                {
                    dateEnd: {
                        [Op.between]: [
                            dateFilters['dateBegin'],
                            dateFilters['dateEnd'],
                        ],
                    },
                },
            ],
        };
    }
    const queryFiltersArray = Object.entries(queryFilters).map(
        ([key, value]) => {
            return {
                key,
                operator: { [Op.like]: `${value}%` },
            };
        }
    );
    const filters = fromPairs(map(queryFiltersArray, i => [i.key, i.operator]));

    req.dateFiltersQuery = dateFiltersQuery;
    req.filters = filters;
    req.pagination = page;
    req.count = count;
    return next();
};
