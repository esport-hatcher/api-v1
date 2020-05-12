import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireValidation,
    requireTeamOwnerOrAdmin,
    requireFiltersOrPagination,
    requireOwnerTeamMember,
    requireUserTeamMember,
} from '@middlewares';
import { taskController } from '@controllers';

const taskRoutes = BaseRouter();

taskRoutes.use(requireAuth);

/**
 * CRUD routes
 */

taskRoutes.get(
    '/',
    requireFiltersOrPagination,
    requireOwnerTeamMember,
    taskController.findAll
);

taskRoutes.get('/:taskId', requireOwnerTeamMember, taskController.findById);

taskRoutes.post(
    '/',
    [
        body('title').trim().isLength({ min: 1 }),
        body('description').trim().isLength({ min: 1 }),
        body('dateBegin').trim(),
        body('deadline').trim(),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    taskController.create
);

taskRoutes.patch(
    '/:taskId',
    requireTeamOwnerOrAdmin,
    taskController.updateById
);

taskRoutes.delete(
    '/:taskId',
    requireTeamOwnerOrAdmin,
    taskController.deleteById
);

/**
 * TaskUsers Routes
 */

taskRoutes.get(
    '/:taskId/users',
    requireOwnerTeamMember,
    taskController.getTaskUsers
);

taskRoutes.get(
    '/:taskId/users/:userId',
    requireOwnerTeamMember,
    requireUserTeamMember,
    taskController.getTaskUser
);

taskRoutes.post(
    '/:taskId/users/:userId',
    requireTeamOwnerOrAdmin,
    requireUserTeamMember,
    taskController.createTaskUser
);

taskRoutes.patch(
    '/:taskId/users/:userId',
    requireTeamOwnerOrAdmin,
    requireUserTeamMember,
    taskController.updateTaskUser
);

taskRoutes.delete(
    '/:taskId/users/:userId',
    requireTeamOwnerOrAdmin,
    requireUserTeamMember,
    taskController.deleteTaskUser
);

export { taskRoutes };
