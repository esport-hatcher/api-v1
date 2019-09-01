import IRequest from '@typings/general/IRequest';
import { Response, NextFunction } from 'express';
import User from '@models/User';
import Team from '@models/Team';

export const findByPagination = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let model;
        let result;
        switch (req.baseUrl) {
            case '/users':
                model = User;
                break;
            case '/teams':
                model = Team;
                break;
            default:
                return next();
        }
        if (req.query.page) {
            const { page } = req.query || 1;
            const perPage = 2;
            result = await model.findAll({
                limit: perPage,
                offset: (page - 1) * perPage,
            });
        } else {
            result = await model.findAll();
        }
        return res.status(200).json(result);
    } catch (err) {
        return next(err);
    }
};
