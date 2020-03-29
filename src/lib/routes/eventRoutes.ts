import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireValidation,
    requireTeamOwnerOrAdmin,
    requireFiltersOrPagination,
    requireTeamMember,
} from '@middlewares';
import { eventController } from '@controllers';

const eventRoutes = BaseRouter();

eventRoutes.use(requireAuth);

/**
 * Get routes
 */

eventRoutes.get(
    '/',
    requireFiltersOrPagination,
    requireTeamMember,
    eventController.findAll
);

eventRoutes.get('/:eventId', requireTeamMember, eventController.findById);

/**
 * Post routes
 */

eventRoutes.post(
    '/',
    [
        body('title')
            .trim()
            .isLength({ min: 1 }),
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
    requireTeamOwnerOrAdmin,
    eventController.create
);

/**
 * Patch routes
 */

eventRoutes.patch(
    '/:eventId',
    requireTeamOwnerOrAdmin,
    eventController.updateById
);

/**
 * Delete routes
 */

eventRoutes.delete(
    '/:eventId',
    requireTeamOwnerOrAdmin,
    eventController.deleteById
);

export { eventRoutes };
