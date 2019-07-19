import { Request } from 'express';
import User from '@models/User';

export default interface IRequest extends Request {
    user: User;
}
