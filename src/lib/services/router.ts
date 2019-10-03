import { Router } from 'express';
import { userResolver, teamResolver, eventResolver } from '@routes';

export const BaseRouter = (): Router =>
    Router({ mergeParams: true })
        .param('userId', userResolver)
        .param('teamId', teamResolver)
        .param('eventId', eventResolver);
