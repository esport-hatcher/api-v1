import { Response, NextFunction } from 'express';
import IRequest from '@typings/general/IRequest';
import { logRequest } from '@utils/decorators';
import Team from '@models/Team';
import User from '@models/User';
import { unauthorizedError, notFoundError } from '@utils/errors';

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
    async addTeamUser(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { user } = req;
            const { userId, teamId } = req.params;

            const team = await Team.findByPk(teamId);
            if (!team) {
                return next(notFoundError('Team'));
            }
            const invitedUser = await User.findByPk(userId);
            if (!invitedUser) {
                return next(notFoundError('Invited user'));
            }
            const users = await team.getUsers();
            const teamUser = users.find(teamUser => teamUser.id === user.id);
            if (
                !teamUser ||
                (teamUser.TeamUser.role !== 'Owner' &&
                    teamUser.TeamUser.role !== 'Admin')
            ) {
                return next(unauthorizedError());
            }
            team.addUser(invitedUser, {
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
    async findAll(
        // tslint:disable-next-line: variable-name
        req: IRequest,
        res: Response,
        next: NextFunction
    ) {
        let teams;
        try {
            if (req.query.page) {
                const { page } = req.query || 1;
                const perPage = 15;
                teams = await Team.findAll({
                    limit: perPage,
                    offset: (page - 1) * perPage,
                });
            } else {
                teams = await Team.findAll();
            }
            return res.status(200).json(teams);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async findById(req: IRequest, res: Response, next: NextFunction) {
        const { teamID } = req.params;

        try {
            const team = await Team.findByPk(teamID);

            if (!team) {
                return next(notFoundError('Team'));
            }
            return res.status(200).json(team);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async deleteById(req: IRequest, res: Response, next: NextFunction) {
        const { teamID } = req.params;

        try {
            const team = await Team.findByPk(teamID);
            if (!team) {
                return next(notFoundError('Team'));
            }
            await team.destroy();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async updateById(req: IRequest, res: Response, next: NextFunction) {
        const { teamID } = req.params;
        try {
            const team = await Team.findByPk(teamID);
            if (!team) {
                return next(notFoundError('Team'));
            }
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

export default new TeamsController();
