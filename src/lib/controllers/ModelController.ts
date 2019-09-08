import { omit, fromPairs, map } from 'lodash';
import { Op, Model } from 'sequelize';
import { NextFunction, Response } from 'express';
import IRequest from '@typings/general/IRequest';
import { notFoundError } from '@utils/errors';
import { logRequest } from '@utils/decorators';
import { FORBIDDEN_FIELDS } from '@config/index';

/**
 * Base class to all Controllers
 */
export abstract class ModelController<
    T extends (new () => Model) & typeof Model
> {
    private readonly modelName: string;

    constructor(private readonly model: T) {
        this.modelName = this.model
            .toString()
            .split(' ')[1]
            .toLowerCase();
        this.findAll = this.findAll.bind(this);
        this.findById = this.findById.bind(this);
        this.deleteById = this.deleteById.bind(this);
        this.updateById = this.updateById.bind(this);
        this.create = this.create.bind(this);
    }

    /**
     * Method by defaults.
     * You can implement it yourself on your controller
     */
    @logRequest
    async findAll(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
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
                raw: true,
            });

            return res
                .status(200)
                .json(
                    records.map(record => omit(record, [...FORBIDDEN_FIELDS]))
                );
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async findById(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const id = req.params[`${this.modelName}Id`];

        try {
            const record = await this.model.findByPk(id);

            if (!record) {
                return next(notFoundError(this.modelName));
            }
            return res
                .status(200)
                .json(omit(record.get({ plain: true }), [...FORBIDDEN_FIELDS]));
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async deleteById(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
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
    }

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
