import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest } from '@utils';
import { Club } from '@models';
import { ModelController } from '@controllers';

class ClubController extends ModelController<typeof Club> {
    constructor() {
        super(Club);
    }

    @logRequest
    async create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { name } = req.body;

            const newClub = await Club.create({
                name,
            });
            return res.status(201).json(newClub);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async updateById(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { club } = req;

        try {
            club.name = req.body.name || club.name;
            club.avatarClubUrl = req.body.avatarClubUrl || club.avatarClubUrl;
            club.bannerUrl = req.body.bannerUrl || club.bannerUrl;
            await club.save();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getClubTeams(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { club } = req;
            const clubTeams = await club.getTeams();
            return res.status(200).json(clubTeams);
        } catch (err) {
            return next(err);
        }
    }
}

export const clubController = new ClubController();
