import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireValidation,
    requireTeamOwnerOrAdmin,
    requireFiltersOrPagination,
    requireOwnerTeamMember,
    requireUserTeamMember,
} from '@middlewares';
import { eventController } from '@controllers';

const eventRoutes = BaseRouter();

eventRoutes.use(requireAuth);

/**
 * CRUD routes
 */

eventRoutes.get(
    '/',
    requireFiltersOrPagination,
    requireOwnerTeamMember,
    eventController.findAll
);

eventRoutes.get('/:eventId', requireOwnerTeamMember, eventController.findById);

eventRoutes.post(
    '/',
    [
        body('title').trim().isLength({ min: 1 }),
        body('description').trim().isLength({ min: 1 }),
        body('place').trim().isLength({ min: 1, max: 50 }),
        body('dateBegin').trim(),
        body('dateEnd').trim(),
    ],
    requireValidation,
    requireTeamOwnerOrAdmin,
    eventController.create
);

eventRoutes.patch(
    '/:eventId',
    requireTeamOwnerOrAdmin,
    eventController.updateById
);

eventRoutes.delete(
    '/:eventId',
    requireTeamOwnerOrAdmin,
    eventController.deleteById
);

/**
 * EventUsers Routes
 */

eventRoutes.get(
    '/:eventId/users',
    requireOwnerTeamMember,
    eventController.getEventUsers
);

eventRoutes.get(
    '/:eventId/users/:userId',
    requireOwnerTeamMember,
    requireUserTeamMember,
    eventController.getEventUser
);

eventRoutes.post(
    '/:eventId/users/:userId',
    requireTeamOwnerOrAdmin,
    requireUserTeamMember,
    eventController.createEventUser
);

eventRoutes.patch(
    '/:eventId/users/:userId',
    requireTeamOwnerOrAdmin,
    requireUserTeamMember,
    eventController.updateEventUser
);

eventRoutes.delete(
    '/:eventId/users/:userId',
    requireTeamOwnerOrAdmin,
    requireUserTeamMember,
    eventController.deleteEventUser
);

export { eventRoutes };
