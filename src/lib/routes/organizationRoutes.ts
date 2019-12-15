import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireAdmin,
    requireScopeOrAdmin,
    requireValidation,
    requireFiltersOrPagination,
} from '@middlewares';
import { organizationController } from '@controllers';

const organizationRoutes = BaseRouter();

organizationRoutes.use(requireAuth);

/**
 * Get routes
 */

organizationRoutes.get(
    '/',
    requireAdmin,
    requireFiltersOrPagination,
    organizationController.findAll
);

organizationRoutes.get('/:organizationId', organizationController.findById);

/**
 * Post routes
 */
organizationRoutes.post(
    '/',
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 40 })
            .withMessage('Please enter a name between 5 and 40 characters'),
    ],
    requireValidation,
    organizationController.create
);

/**
 * Patch routes
 */
organizationRoutes.patch(
    '/:organizationId',
    requireScopeOrAdmin,
    organizationController.updateById
);

/**
 * Delete routes
 */
organizationRoutes.delete(
    '/:organizationId',
    requireScopeOrAdmin,
    organizationController.deleteById
);

export { organizationRoutes };
