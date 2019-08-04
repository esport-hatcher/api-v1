import { Request } from 'express';
import User from '@models/User';
import Team from '@models/Team';

export default interface IRequest extends Request {
    user: User;
    team: Team;
}
