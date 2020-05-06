import { NextFunction, Response } from 'express';
import { IRequest } from '@typings';
import { seedData } from '@db';

export const seeder = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    const { instances } = req.query;

    try {
        await seedData(Number(instances));
        return res.status(200).json({
            status: 'Success',
        });
    } catch (err) {
        return next(err);
    }
};
