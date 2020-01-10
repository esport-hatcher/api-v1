import { Request } from 'express';
import { User, Team, Event, Task } from '@models';
import { Dictionary } from 'lodash';
import { Op } from 'sequelize';

export interface IRequest extends Request {
    /**
     * if the request is protected with requireAuth, it will store the user making the request
     */
    owner: User;
    /**
     * If there is a :teamId in the route making the request, the team will be stored in this variable
     */
    team: Team;
    /**
     * If there is a :userId in the route making the request, the user will be stored in this variable
     */
    user: User;
    /**
     * If there is a :eventId in the route making the request, the event will be stored in this variable
     */
    event: Event;
    /**
     * If there is a :eventId in the route making the request, the event will be stored in this variable
     */
    task: Task;
    /**
     * If there is a filter in the route making the request, the filter will be stored in this variable
     */
    filters: Dictionary<{
        [Op.like]: string;
    }>;
    /**
     * If there is a pagination in the route making the request, the pagination will be stored in this variable
     */
    pagination: number;
    /**
     * If the count mode is true then the findAll with just perform a findAndCountAll instead of a findAll
     */
    count: boolean;

    // tslint:disable-next-line: no-any
    body: { [key: string]: any | undefined };
}
