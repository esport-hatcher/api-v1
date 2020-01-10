import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireAdmin,
    requireScopeOrAdmin,
    requireValidation,
    requireOwnerOrAdminTeam,
    requireFiltersOrPagination,
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
taskRoutes.get('/:taskId/users', requireAuth, taskController.getTaskUser);

taskRoutes.get('/:taskId', taskController.findById);

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
        body('deadline').trim(),
        body('dateBegin').trim(),
        body('dateEnd').trim(),
    ],
    requireValidation,
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
taskRoutes.patch('/:taskId', requireScopeOrAdmin, taskController.updateById);

/**
 * Delete routes
 */
taskRoutes.delete('/:taskId', requireScopeOrAdmin, taskController.deleteById);

taskRoutes.delete(
    '/:taskId/members/:userId',
    requireValidation,
    requireOwnerOrAdminTeam,
    taskController.deleteTaskUser
);

export { taskRoutes };
