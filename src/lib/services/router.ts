import { Router } from 'express';
import { userResolver, teamResolver } from '@routes';

// tslint:disable-next-line: variable-name
export const BaseRouter = (): Router =>
    Router()
        .param('userId', userResolver)
        .param('teamId', teamResolver);
