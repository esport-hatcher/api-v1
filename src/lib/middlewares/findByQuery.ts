import IRequest from '@typings/general/IRequest';
import { Response, NextFunction } from 'express';
import User from '@models/User';
import Team from '@models/Team';
import { pick, omit, fromPairs, map } from 'lodash';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

export const findByQuery = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
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
        result = await model.findAll({
            limit: PER_PAGE,
            offset: (page - 1) * PER_PAGE,
            where: filters,
        });
        return res
            .status(200)
            .json(
                result.map(model =>
                    pick(
                        model,
                        'id',
                        'name',
                        'game',
                        'region',
                        'avatarTeamUrl',
                        'bannerUrl',
                        'username',
                        'email',
                        'avatarUrl',
                        'country',
                        'city',
                        'hashtag',
                        'phoneNumber',
                        'superAdmin',
                        'createdAt',
                        'updatedAt'
                    )
                )
            );
    } catch (err) {
        return next(err);
    }
};
