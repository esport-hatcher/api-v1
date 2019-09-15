import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest, unauthorizedError, notFoundError } from '@utils';
import { Team, User } from '@models';
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
    async addTeamUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { user } = req;
            const { userId, teamId } = req.params;

            const team = await Team.findByPk(teamId);
            /**
             * Check if the team exists
             */
            if (!team) {
                return next(notFoundError('Team'));
            }
            const invitedUser = await User.findByPk(userId);
            /**
             * Check if the user we want to invite exists
             */
            if (!invitedUser) {
                return next(notFoundError('Invited user'));
            }
            const users = await team.getUsers();
            const userInTeam = users.find(
                userInTeam => userInTeam.id === user.id
            );
            /**
             * Check if the userInTeam has the permission to invite someone
             */
            if (
                !userInTeam ||
                (userInTeam.TeamUser.role !== 'Owner' &&
                    userInTeam.TeamUser.role !== 'Admin')
            ) {
                return next(unauthorizedError());
            }
            /**
             * Check if the userInTeam had already request to join the team and accept him if it's true
             */
            if (userInTeam.TeamUser.playerStatus === true) {
                await userInTeam.TeamUser.update({ teamStatus: true });
                return res.sendStatus(201);
            }
            /**
             * Invite a user in the team by putting the teamStatus on "true"
             */
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
    async updateById(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { teamId } = req.params;
        try {
            const team = await Team.findByPk(teamId);
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

export const teamController = new TeamsController();
