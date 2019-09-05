import { omit, fromPairs, map } from 'lodash';
import { Op, Model } from 'sequelize';
import IRequest from '@typings/general/IRequest';
import { NextFunction, Response } from 'express';
import { notFoundError } from '@utils/errors';

/**
 * Base class to all Controllers
 */
export abstract class ModelController<
    T extends (new () => Model) & typeof Model
> {
    private readonly modelName: string;

    constructor(public model: T) {
        this.modelName = this.model
            .toString()
            .split(' ')[1]
            .toLowerCase();
    }

    /**
     * Method by defaults.
     * You can implement it yourself on your controller
     */
    findAll = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        const page = req.query.page || 1;
        const PER_PAGE = 50;

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

        try {
            const records = await this.model.findAll({
                limit: PER_PAGE,
                offset: (page - 1) * PER_PAGE,
                where: filters,
            });
            return res.status(200).json(records);
        } catch (err) {
            return next(err);
        }
    };

    findById = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        const id = req.params[`${this.modelName}Id`];

        try {
            const record = await this.model.findByPk(id);

            if (!record) {
                return next(notFoundError(this.modelName));
            }
            return res.status(200).json(record);
        } catch (err) {
            return next(err);
        }
    };

    deleteById = async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        const id = req.params[`${this.modelName}Id`];

        try {
            const record = await this.model.findByPk(id);
            if (!record) {
                return next(notFoundError(this.modelName));
            }
            await record.destroy();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    };

    /**
     * Method YOU MUST implement yourself
     */
    abstract updateById(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response>;

    abstract create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response>;
}
