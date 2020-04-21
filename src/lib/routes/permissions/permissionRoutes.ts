import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireValidation,
    requireTeamOwnerOrAdmin,
} from '@middlewares';
import { permissionController } from '@controllers';

const permissionRoutes = BaseRouter();

permissionRoutes.use(requireAuth);

/**
 * Get routes
 */

permissionRoutes.get('/', requireAuth, permissionController.findAll);

/**
 * Post routes
 */
permissionRoutes.post(
    '/',
    [
        body('scope')
            .trim()
            .isLength({ min: 1, max: 128 }),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    permissionController.create
);

permissionRoutes.post(
    '/:permissionId/role',
    [
        body('roleId')
            .trim()
            .isInt(),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    permissionController.addRole
);

permissionRoutes.post(
    '/:permissionId/action',
    [
        body('actionId')
            .trim()
            .isInt(),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    permissionController.addAction
);

/**
 * Patch routes
 */
permissionRoutes.patch(
    '/:permissionId',
    [
        body('scope')
            .trim()
            .isLength({ min: 1, max: 128 }),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    permissionController.updateById
);

/**
 * Delete routes
 */
permissionRoutes.delete(
    '/:permissionId',
    requireTeamOwnerOrAdmin,
    permissionController.delete
);

permissionRoutes.delete(
    '/:permissionId/role',
    [
        body('roleId')
            .trim()
            .isInt(),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    permissionController.removeRole
);

permissionRoutes.delete(
    '/:permissionId/action',
    [
        body('actionId')
            .trim()
            .isInt(),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    permissionController.removeAction
);

export { permissionRoutes };
