import { Router } from 'express';
import { body } from 'express-validator/check';
import {
    requireAuth,
    requireAdmin,
    requireScopeOrAdmin,
    requireValidation,
} from '@middlewares';
import teamsController from '@controllers/teamsController';

const teamsRoutes = Router();

/**
 * Get routes
 */

teamsRoutes.get(
    '/',
    requireAuth,
    requireAdmin,
    teamsController.findAll.bind(teamsController)
);

teamsRoutes.get(
    '/:teamId',
    requireAuth,
    teamsController.findById.bind(teamsController)
);

/**
 * Post routes
 */
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
    teamsController.create.bind(teamsController)
);

teamsRoutes.post(
    '/:teamId/members/:userId',
    [
        body('role')
            .trim()
            .withMessage('Please enter a role'),
    ],
    requireValidation,
    requireAuth,
    teamsController.addTeamUser.bind(teamsController)
);

/**
 * Patch routes
 */
teamsRoutes.patch(
    '/:teamId',
    requireAuth,
    requireScopeOrAdmin,
    teamsController.updateById.bind(teamsController)
);

/**
 * Delete routes
 */
teamsRoutes.delete(
    '/:teamId',
    requireAuth,
    requireScopeOrAdmin,
    teamsController.deleteById.bind(teamsController)
);

export default teamsRoutes;
