import { Router } from 'express';
import { body } from 'express-validator/check';
import {
    requireAuth,
    requireAdmin,
    requireScopeOrAdmin,
    requireValidation,
    requireOwnerOrAdminTeam,
} from '@middlewares';
import { teamController } from '@controllers';

const teamsRoutes = Router();

/**
 * Get routes
 */

teamsRoutes.get('/', requireAuth, requireAdmin, teamController.findAll);

teamsRoutes.get('/:teamId', requireAuth, teamController.findById);

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
    teamController.create
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
    requireOwnerOrAdminTeam,
    teamController.addTeamUser
);

/**
 * Patch routes
 */
teamsRoutes.patch(
    '/:teamId',
    requireAuth,
    requireScopeOrAdmin,
    teamController.updateById
);

/**
 * Delete routes
 */
teamsRoutes.delete(
    '/:teamId',
    requireAuth,
    requireScopeOrAdmin,
    teamController.deleteById
);

export { teamsRoutes };
