import { Router } from 'express';
import { body } from 'express-validator/check';
import { requireAuth, requireAdmin } from '@middlewares';
import eventController from '@controllers/eventController';
import { requireValidation } from '../middlewares/requireValidation';

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
        body('from').trim(),
        body('to').trim(),
    ],
    requireValidation,
    requireAuth,
    eventController.createEvent
);

eventRoutes.get('/', requireAuth, requireAdmin, eventController.findAll);

export default eventRoutes;
