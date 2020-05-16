import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest, forbiddenError, debug } from '@utils';
import { Team, Role, RoleUser, User } from '@models';
import { ModelController } from '@controllers';
import { FORBIDDEN_FIELDS } from '@config';

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
                return res.sendStatus(201);
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
            return res.sendStatus(201);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async assignRoleToUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { user, team, role } = req;
            const teamRoles: Array<Role> = await team.getRoles();
            const teamUsers: Array<User> = await team.getUsers();

            teamUsers.forEach(user => {
                debug('Test', user.id.toString());
            });

            if (teamUsers.includes(user)) {
                const existingRoleUser = await RoleUser.findOne({
                    where: {
                        UserId: user.id,
                    },
                });

                if (existingRoleUser) {
                    existingRoleUser.destroy();
                }

                if (role.primary || teamRoles.includes(role)) {
                    await role.addUser(user);
                    await RoleUser.findOne({
                        where: {
                            RoleId: role.id,
                            UserId: user.id,
                        },
                    }).then(roleUser => {
                        roleUser.setTeam(team);

                        return null;
                    });
                }

                return res.sendStatus(204);
            }

            return next(forbiddenError);
        } catch (err) {
            debug('Something went wrong');
            return next(err);
        }
    }
}

export const teamController = new TeamsController();
