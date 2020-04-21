import {
    User,
    Team,
    Event,
    IEventProps,
    ITeamProps,
    IUserProps,
    TeamUserRole,
} from '@models';
import {
    getRandomTeamProps,
    getRandomEventProps,
    getRandomUserProps,
} from '@utils';

/**
 * return a new team stored in the database and fully functional
 * @param teamUser - expect an object with the user and the role associated (by default Owner)
 * @param teamProps  - optional
 */
export const getTeam = async (
    teamUser?: { user: User; role?: TeamUserRole },
    teamProps?: ITeamProps
): Promise<Team> => {
    const newTeam: Team = await Team.create(
        teamProps ? teamProps : getRandomTeamProps()
    );

    if (teamUser) {
        const { user, role } = teamUser;

        await newTeam.addUser(user, {
            through: {
                role: role ? role : 'Owner',
                playerStatus: true,
                teamStatus: true,
            },
        });
    }
    return newTeam;
};

/**
 *
 * @param team - Team from which the event will be created
 * @param eventProps  - optional
 */
export const getEvent = async (
    team: Team,
    eventProps?: IEventProps
): Promise<Event> => {
    return team.createEvent(
        // tslint:disable-next-line: no-any
        (eventProps ? eventProps : getRandomEventProps()) as any
    );
};

/**
 *
 * @param superAdmin Is the user a super admin
 */
export const getUser = async (superAdmin: boolean = false): Promise<User> => {
    const user: IUserProps = getRandomUserProps(superAdmin);
    return User.create(user);
};
