import { Response, NextFunction } from 'express';
import IRequest from '@typings/general/IRequest';
import { logRequest } from '@utils/decorators';
import Team from '@models/Team';

class TeamsController {
    @logRequest
    async createTeams(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { user } = req;
            const { game, name, region } = req.body;

            const newTeam = await Team.create({
                game,
                region,
                name,
            });
            await newTeam.addUser(user, {
                through: {
                    role: 'admin',
                    playerStatus: true,
                    teamStatus: true,
                },
            });
            return res.sendStatus(201);
        } catch (err) {
            return next(err);
        }
    }
}

export default new TeamsController();
