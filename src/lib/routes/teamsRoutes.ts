import { Router } from 'express';
import { body } from 'express-validator/check';

const teamsRoutes = Router();

teamsRoutes.post('/', [
    body('name')
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage('Please enter a name between 5 and 40 characters'),
    body('game').trim(),
    body('region').trim(),
]);

export default teamsRoutes;
