import { Response, NextFunction } from 'express';
import IRequest from '@typings/general/IRequest';
import { logRequest } from '@utils/decorators';
import User from '@models/User';

class TeamsController {
    @logRequest
    async createTeams(req: IRequest, res: Response, next: NextFunction) {
        try {
            const user = await User.findOne({
                where: { email: req.user.email },
            });
            const team = user.createTeam({
                game: req.body.game,
                name: req.body.name,
                region: req.body.region,
            });
            //user.joinTeam()
            return res.status(201).json({ create: team });
        } catch (err) {
            return next(err);
        }
    }
}

export default new TeamsController();
