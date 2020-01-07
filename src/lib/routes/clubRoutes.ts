import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireAdmin,
    requireScopeOrAdmin,
    requireValidation,
    requireFiltersOrPagination,
} from '@middlewares';
import { clubController } from '@controllers';

const clubRoutes = BaseRouter();

clubRoutes.use(requireAuth);

/**
 * Get routes
 */

clubRoutes.get(
    '/',
    requireAdmin,
    requireFiltersOrPagination,
    clubController.findAll
);

clubRoutes.get('/:clubId', clubController.findById);

/**
 * Post routes
 */
clubRoutes.post(
    '/',
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 40 })
            .withMessage('Please enter a name between 5 and 40 characters'),
    ],
    requireValidation,
    clubController.create
);

/**
 * Patch routes
 */
clubRoutes.patch('/:clubId', requireScopeOrAdmin, clubController.updateById);

/**
 * Delete routes
 */
clubRoutes.delete('/:clubId', requireScopeOrAdmin, clubController.deleteById);

export { clubRoutes };
