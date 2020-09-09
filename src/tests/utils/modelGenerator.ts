import {
    User,
    Team,
    Event,
    Task,
    IEventProps,
    ITaskProps,
    ITeamProps,
    IUserProps,
    TeamUserRole,
} from '@models';
import {
    getRandomTeamProps,
    getRandomEventProps,
    getRandomTaskProps,
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
 * @param user - User from which the event will be created
 * @param team - Team from which the event will be created
 * @param eventProps  - optional
 */
export const getEvent = async (
    user: User | null = null,
    team: Team | null = null,
    eventProps: IEventProps = getRandomEventProps()
): Promise<Event> => {
    if (team) {
        // tslint:disable-next-line: no-any
        return team.createEvent(eventProps as any);
    }
    const event = await Event.create(eventProps);
    await user.addEvent(event);
    return event;
};

/**
 * @param user - User from which the task will be created
 * @param team - Team from which the task will be created
 * @param taskProps  - optional
 */
export const getTask = async (
    user: User | null = null,
    team: Team | null = null,
    taskProps: ITaskProps = getRandomTaskProps()
): Promise<Task> => {
    if (team) {
        // tslint:disable-next-line: no-any
        return team.createTask(taskProps as any);
    }
    const task = await Task.create(taskProps);
    await user.addTask(task);
    return task;
};

/**
 *
 * @param superAdmin Is the user a super admin
 */
export const getUser = async (superAdmin: boolean = false): Promise<User> => {
    const user: IUserProps = getRandomUserProps(superAdmin);
    return User.create(user);
};
