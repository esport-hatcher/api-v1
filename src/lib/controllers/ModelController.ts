import { omit } from 'lodash';
import { Model } from 'sequelize';
import { NextFunction, Response } from 'express';
import { IRequest } from '@typings';
import { logRequest } from '@utils';
import { FORBIDDEN_FIELDS, RECORDS_PER_PAGE } from '@config';

/**
 * Base class to all Controllers
 */
export abstract class ModelController<
    T extends (new () => Model) & typeof Model
> {
    private readonly modelName: string;

    constructor(private readonly model: T) {
        this.modelName = this.model.toString().split(' ')[1].toLowerCase();
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
        const { pagination, filters, count } = req;

        try {
            if (!count) {
                const records = await this.model.findAll({
                    limit: RECORDS_PER_PAGE,
                    offset: (pagination - 1) * RECORDS_PER_PAGE,
                    where: filters,
                    raw: true,
                });
                return res
                    .status(200)
                    .json(
                        records.map(record => omit(record, ...FORBIDDEN_FIELDS))
                    );
            }
            const recordsCount = await this.model.count({ where: filters });
            return res.status(200).json({ records: recordsCount });
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
        const instance = req[`${this.modelName}`];

        try {
            return res
                .status(200)
                .json(omit(instance.get({ plain: true }), ...FORBIDDEN_FIELDS));
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
        const instance = req[`${this.modelName}`];

        try {
            await instance.destroy();
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
