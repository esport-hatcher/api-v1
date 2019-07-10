import { Router } from 'express';
import { body } from 'express-validator/check';
import { requireAuth } from '@middlewares';
import teamsController from '@controllers/teamsController';

const teamsRoutes = Router();

teamsRoutes.post(
    '/create',
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 40 })
            .withMessage('Please enter a name between 5 and 40 characters'),
        body('game').trim(),
        body('region').trim(),
    ],
    requireAuth,
    teamsController.createTeams
);

export default teamsRoutes;
