import { Router } from 'express';
import { body } from 'express-validator/check';
import {
    requireAuth,
    requireAdmin,
    requireScopeOrAdmin,
    requireValidation,
} from '@middlewares';
import { eventController } from '@controllers';

const eventRoutes = Router();

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
    requireAuth,
    eventController.create
);

eventRoutes.get('/', requireAuth, requireAdmin, eventController.findAll);
eventRoutes.get('/:eventId', requireAuth, eventController.findById);

eventRoutes.delete(
    '/:eventId',
    requireAuth,
    requireScopeOrAdmin,
    eventController.deleteById
);

eventRoutes.patch(
    '/:eventId',
    requireAuth,
    requireScopeOrAdmin,
    eventController.updateById
);

export { eventRoutes };
