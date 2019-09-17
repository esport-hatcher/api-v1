import { Request } from 'express';
import { User, Team, Event } from '@models';

export interface IRequest extends Request {
    /**
     * if the request is protected with requireAuth, it will store the user making the request
     */
    owner: User;
    /**
     * If their is a :teamId in the route making the request, the team will be stored in this variable
     */
    team: Team;
    /**
     * If their is a :userId in the route making the request, the user will be stored in this variable
     */
    user: User;
    /**
     * If their is a :eventId in the route making the request, the user will be stored in this variable
     */
    event: Event;
    // tslint:disable-next-line: no-any
    body: { [key: string]: any | undefined };
}
