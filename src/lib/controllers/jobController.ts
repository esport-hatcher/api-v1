import IRequest from '@typings/general/IRequest';
import { NextFunction } from 'connect';
import { seedData } from '@utils/seeders';
import { Response } from 'express';

export const seeder = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    const { instances } = req.query;

    try {
        await seedData(instances);
        return res.status(200).json({
            status: 'Success',
        });
    } catch (err) {
        return next(err);
    }
};
