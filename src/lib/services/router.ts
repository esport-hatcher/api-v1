import { Router } from 'express';
import { userResolver, teamResolver, eventResolver } from '@routes';

// tslint:disable-next-line: variable-name
export const BaseRouter = (): Router =>
    Router({ mergeParams: true })
        .param('userId', userResolver)
        .param('teamId', teamResolver)
        .param('eventId', eventResolver);
