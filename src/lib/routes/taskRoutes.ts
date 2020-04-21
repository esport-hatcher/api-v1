import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireAdmin,
    requireValidation,
    requireTeamOwnerOrAdmin,
    requireFiltersOrPagination,
    requireOwnerTeamMember,
} from '@middlewares';
import { taskController } from '@controllers';

const taskRoutes = BaseRouter();

taskRoutes.use(requireAuth);

/**
 * Get routes
 */

taskRoutes.get(
    '/',
    requireAdmin,
    requireFiltersOrPagination,
    taskController.findAll
);
taskRoutes.get(
    '/:taskId/users',
    requireOwnerTeamMember,
    taskController.getTaskUser
);

taskRoutes.get('/:taskId', requireOwnerTeamMember, taskController.findById);

/**
 * Post routes
 */
taskRoutes.post(
    '/',
    [
        body('title')
            .trim()
            .isLength({ min: 1 }),
        body('description')
            .trim()
            .isLength({ min: 1 }),
        body('dateBegin').trim(),
        body('deadline').trim(),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    taskController.create
);

taskRoutes.post(
    '/:taskId/members/:userId',
    requireValidation,
    requireTeamOwnerOrAdmin,
    taskController.addTaskUser
);

/**
 * Patch routes
 */
taskRoutes.patch(
    '/:taskId',
    requireTeamOwnerOrAdmin,
    taskController.updateById
);

/**
 * Delete routes
 */
taskRoutes.delete(
    '/:taskId',
    requireTeamOwnerOrAdmin,
    taskController.deleteById
);

taskRoutes.delete(
    '/:taskId/members/:userId',
    requireTeamOwnerOrAdmin,
    taskController.deleteTaskUser
);

export { taskRoutes };
