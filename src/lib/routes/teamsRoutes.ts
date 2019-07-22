import { Router } from 'express';
import { body } from 'express-validator/check';
import { requireAuth, requireAdmin, requireScopeOrAdmin } from '@middlewares';
import teamsController from '@controllers/teamsController';
import { requireValidation } from '../middlewares/requireValidation';

const teamsRoutes = Router();

teamsRoutes.post(
    '/',
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 40 })
            .withMessage('Please enter a name between 5 and 40 characters'),
        body('game')
            .trim()
            .isLength({ min: 1 }),
        body('region')
            .trim()
            .isLength({ min: 2, max: 2 }),
    ],
    requireValidation,
    requireAuth,
    teamsController.createTeams
);

teamsRoutes.post(
    '/addUser',
    [
        body('role')
            .trim()
            .withMessage('Please enter a role'),
        body('userEmail')
            .isEmail()
            .withMessage('Please enter a valid User email'),
        body('name')
            .trim()
            .isLength({ min: 2, max: 40 })
            .withMessage('Please a enter a teams wich exist'),
    ],
    requireValidation,
    requireAuth,
    teamsController.addTeamUser
);

teamsRoutes.get('/', requireAuth, requireAdmin, teamsController.findAll);
teamsRoutes.get('/:teamID', requireAuth, teamsController.findById);

teamsRoutes.delete(
    '/:teamID',
    requireAuth,
    requireScopeOrAdmin,
    teamsController.deleteById
);

teamsRoutes.patch(
    '/:teamID',
    requireAuth,
    requireScopeOrAdmin,
    teamsController.updateById
);

export default teamsRoutes;
