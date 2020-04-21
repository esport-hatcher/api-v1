import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireValidation,
    requireTeamOwnerOrAdmin,
} from '@middlewares';
import { actionController } from '@controllers';

const actionRoutes = BaseRouter();

actionRoutes.use(requireAuth);

/**
 * Get routes
 */

actionRoutes.get('/', requireAuth, actionController.findAll);

/**
 * Post routes
 */
actionRoutes.post(
    '/',
    [
        body('action')
            .trim()
            .isLength({ min: 1, max: 128 }),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    actionController.create
);

/**
 * Patch routes
 */
actionRoutes.patch(
    '/:actionId',
    [
        body('action')
            .trim()
            .isLength({ min: 1, max: 128 }),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    actionController.updateById
);

/**
 * Delete routes
 */
actionRoutes.delete(
    '/:actionId',
    requireTeamOwnerOrAdmin,
    actionController.delete
);

export { actionRoutes };
