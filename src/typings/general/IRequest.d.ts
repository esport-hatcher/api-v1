import { Request } from 'express';
import { User } from '@models';

export interface IRequest extends Request {
    user: User;
    // tslint:disable-next-line: no-any
    body: { [key: string]: any | undefined };
}
