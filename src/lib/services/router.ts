import { Router } from 'express';
import {
    userResolver,
    teamResolver,
    eventResolver,
    clubResolver,
} from '@routes';

export const BaseRouter = (): Router =>
    Router({ mergeParams: true })
        .param('userId', userResolver)
        .param('clubId', clubResolver)
        .param('teamId', teamResolver)
        .param('eventId', eventResolver);
