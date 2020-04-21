import { Router } from 'express';
import {
    userResolver,
    teamResolver,
    eventResolver,
    taskResolver,
    roleResolver,
    actionResolver,
} from '@routes';

export const BaseRouter = (): Router =>
    Router({ mergeParams: true })
        .param('userId', userResolver)
        .param('teamId', teamResolver)
        .param('eventId', eventResolver)
        .param('taskId', taskResolver)
        .param('roleId', roleResolver)
        .param('actionId', actionResolver);
