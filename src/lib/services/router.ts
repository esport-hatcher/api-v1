import { Router } from 'express';
import {
    userResolver,
    teamResolver,
    eventResolver,
    organizationResolver,
} from '@routes';

export const BaseRouter = (): Router =>
    Router({ mergeParams: true })
        .param('userId', userResolver)
        .param('organizationId', organizationResolver)
        .param('teamId', teamResolver)
        .param('eventId', eventResolver);
