import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireValidation,
    requireTeamOwnerOrAdmin,
} from '@middlewares';
import { roleController } from '@controllers';

const roleRoutes = BaseRouter();

roleRoutes.use(requireAuth);

/**
 * Get routes
 */

roleRoutes.get('/:teamId', requireAuth, roleController.findAll);

roleRoutes.get('/default', requireAuth, roleController.findDefault);

/**
 * Post routes
 */
roleRoutes.post(
    '/:teamId',
    [
        body('name')
            .trim()
            .isLength({ min: 1, max: 128 }),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    roleController.create
);

/**
 * Patch routes
 */
roleRoutes.patch(
    '/:roleId',
    [
        body('name')
            .trim()
            .isLength({ min: 1, max: 128 }),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    roleController.updateById
);

/**
 * Delete routes
 */
roleRoutes.delete(
    '/:roleId',
    requireTeamOwnerOrAdmin,
    roleController.deleteById
);

export { roleRoutes };
