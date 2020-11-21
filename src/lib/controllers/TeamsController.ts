import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { getLolStats, logRequest } from '@utils';
import { Team, User } from '@models';
import { ModelController } from '@controllers';
import { FORBIDDEN_FIELDS } from '@config';
import { Constants } from 'twisted';

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
    async findAllByUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { user } = req;

        try {
            const teams = await user.getTeams({ include: [User] });
            return res.status(200).json(teams);
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

    /**
     * Methods related to team members
     */

    @logRequest
    async getTeamUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { team } = req;
            const teamUsers = await team.getUsers({
                attributes: { exclude: FORBIDDEN_FIELDS },
            });
            return res.status(200).json(teamUsers);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getTeamUserById(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { user } = req;
            return res.status(200).json(user.get({ plain: true }));
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
            const { user, team } = req;
            const teamUsers = await team.getUsers();
            /**
             * Check if the invited user has already request to join the team
             */
            const userInTeam = teamUsers.find(
                userRequest => userRequest.id === user.id
            );
            /**
             * If the userInTeam has already request to join the team accept him
             */
            if (userInTeam) {
                await userInTeam.TeamUser.update({ teamStatus: true });
                return res.status(201).json(userInTeam.get({ plain: true }));
            }
            /**
             * Invite a user in the team by putting the teamStatus on "true"
             */
            team.addUser(user, {
                through: {
                    teamStatus: true,
                    playerStatus: false,
                },
            });
            return res.status(201).json(user.get({ plain: true }));
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async patchTeamUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { owner, user } = req;

            if (
                owner.TeamUser.role === 'Owner' ||
                owner.TeamUser.role === 'Admin'
            ) {
                user.TeamUser.role = req.body.role || user.TeamUser.role;
            }
            if (owner.id === user.id) {
                user.TeamUser.color = req.body.color || user.TeamUser.color;
                user.TeamUser.lolSummonerName =
                    req.body.lolSummonerName || user.TeamUser.lolSummonerName;
                user.TeamUser.lolRegion =
                    req.body.lolRegion || user.TeamUser.lolRegion;
                user.TeamUser.twitchUsername =
                    req.body.twitchUsername || user.TeamUser.twitchUsername;
            }
            await user.TeamUser.save();
            return res.status(200).json(user.get({ plain: true }));
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getStats(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { team } = req;
            const teamUsers = await team.getUsers({
                attributes: { exclude: FORBIDDEN_FIELDS },
            });
            const allStats = await Promise.all(
                teamUsers.map(async teamUser => {
                    const region =
                        Constants.Regions[teamUser.TeamUser.lolRegion];
                    return (
                        teamUser.TeamUser.lolSummonerName &&
                        getLolStats(teamUser.TeamUser.lolSummonerName, region)
                    );
                })
            );
            return res.status(200).json(allStats.filter(item => item));
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getStatsById(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { user } = req;
            const region = Constants.Regions[user.TeamUser.lolRegion];
            const stats = await getLolStats(
                user.TeamUser.lolSummonerName,
                region
            );
            return res.status(200).json(stats);
        } catch (err) {
            return next(err);
        }
    }
}

export const teamController = new TeamsController();
