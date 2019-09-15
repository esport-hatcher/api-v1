import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest, unauthorizedError } from '@utils';
import { Team } from '@models';
import { ModelController } from '@controllers';

class TeamsController extends ModelController<typeof Team> {
    constructor() {
        super(Team);
    }

    @logRequest
    async create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { owner } = req;
            const { game, name, region } = req.body;

            const newTeam = await Team.create({
                game,
                region,
                name,
            });
            await newTeam.addUser(owner, {
                through: {
                    role: 'Owner',
                    playerStatus: true,
                    teamStatus: true,
                },
            });
            return res.status(201).json(newTeam);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async addTeamUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { owner, user, team } = req;

            const users = await team.getUsers();
            const teamUser = users.find(teamUser => teamUser.id === owner.id);
            if (
                !teamUser ||
                (teamUser.TeamUser.role !== 'Owner' &&
                    teamUser.TeamUser.role !== 'Admin')
            ) {
                return next(unauthorizedError());
            }
            team.addUser(user, {
                through: {
                    role: req.body.role,
                    teamStatus: true,
                    playerStatus: false,
                },
            });
            return res.sendStatus(201);
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
        const { team } = req;

        try {
            team.name = req.body.username || team.name;
            team.game = req.body.avatarUrl || team.game;
            team.region = req.body.country || team.region;
            team.avatarTeamUrl = req.body.city || team.avatarTeamUrl;
            team.bannerUrl = req.body.bannerUrl || team.bannerUrl;
            await team.save();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }
}

export const teamController = new TeamsController();
