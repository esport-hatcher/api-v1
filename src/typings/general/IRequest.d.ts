import { Request } from 'express';
import { User, Team } from '@models';

export interface IRequest extends Request {
    owner: User;
    team: Team;
    user: User;
    // tslint:disable-next-line: no-any
    body: { [key: string]: any | undefined };
}
