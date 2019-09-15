import { Router } from 'express';
import { body } from 'express-validator/check';
import {
    requireAuth,
    requireAdmin,
    requireScopeOrAdmin,
    requireValidation,
} from '@middlewares';
import { teamController } from '@controllers';
import { userResolver, teamResolver } from './resolvers';

const teamsRoutes = Router();

teamsRoutes.use(requireAuth);

teamsRoutes.param('userId', userResolver);
teamsRoutes.param('teamId', teamResolver);

/**
 * Get routes
 */

teamsRoutes.get('/', requireAdmin, teamController.findAll);
teamsRoutes.get('/:teamId', teamController.findById);

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
    teamController.addTeamUser
);

/**
 * Patch routes
 */
teamsRoutes.patch('/:teamId', requireScopeOrAdmin, teamController.updateById);

/**
 * Delete routes
 */
teamsRoutes.delete('/:teamId', requireScopeOrAdmin, teamController.deleteById);

export { teamsRoutes };
