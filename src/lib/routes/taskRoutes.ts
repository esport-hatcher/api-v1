import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireAdmin,
    requireValidation,
    requireOwnerOrAdminTeam,
    requireFiltersOrPagination,
    requireTeamMember,
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
taskRoutes.get('/:taskId/users', requireTeamMember, taskController.getTaskUser);

taskRoutes.get('/:taskId', requireTeamMember, taskController.findById);

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
    requireOwnerOrAdminTeam,
    taskController.create
);

taskRoutes.post(
    '/:taskId/members/:userId',
    requireValidation,
    requireOwnerOrAdminTeam,
    taskController.addTaskUser
);

/**
 * Patch routes
 */
taskRoutes.patch(
    '/:taskId',
    requireOwnerOrAdminTeam,
    taskController.updateById
);

/**
 * Delete routes
 */
taskRoutes.delete(
    '/:taskId',
    requireOwnerOrAdminTeam,
    taskController.deleteById
);

taskRoutes.delete(
    '/:taskId/members/:userId',
    requireOwnerOrAdminTeam,
    taskController.deleteTaskUser
);

export { taskRoutes };
