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
import { eventController } from '@controllers';

const eventRoutes = BaseRouter();

eventRoutes.use(requireAuth);

/**
 * Get routes
 */

eventRoutes.get(
    '/',
    requireAdmin,
    requireFiltersOrPagination,
    eventController.findAll
);
eventRoutes.get('/:eventId', eventController.findById);

/**
 * Post routes
 */

eventRoutes.post(
    '/',
    [
        body('title')
            .trim()
            .isLength({ min: 2, max: 20 })
            .withMessage('Please enter a title between 2 and 20 characters'),
        body('description')
            .trim()
            .isLength({ min: 1 }),
        body('place')
            .trim()
            .isLength({ min: 1, max: 50 }),
        body('dateBegin').trim(),
        body('dateEnd').trim(),
    ],
    requireValidation,
    requireOwnerOrAdminTeam,
    eventController.create
);

/**
 * Patch routes
 */

eventRoutes.patch('/:eventId', requireScopeOrAdmin, eventController.updateById);

/**
 * Delete routes
 */

eventRoutes.delete(
    '/:eventId',
    requireScopeOrAdmin,
    eventController.deleteById
);

export { eventRoutes };
