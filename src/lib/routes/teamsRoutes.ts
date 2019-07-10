import { Router } from 'express';
import { body } from 'express-validator/check';
import validateRequest from '@middlewares/validateRequest';
import requireAuth from '@middlewares/requireAuth';
import teamsController from '@controllers/teamsController';

const teamsRoutes = Router();

teamsRoutes.post(
    '/create',
    requireAuth,
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 40 })
            .withMessage('Please enter a name between 5 and 40 characters'),
        body('game').trim(),
        body('region').trim(),
    ],
    validateRequest,
    teamsController.createTeams
);

export default teamsRoutes;
