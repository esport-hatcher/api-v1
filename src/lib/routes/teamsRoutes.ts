import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireAdmin,
    requireScopeOrAdmin,
    requireValidation,
    requireOwnerOrAdminTeam,
    requireFiltersOrPagination,
} from '@middlewares';
import { teamController } from '@controllers';

const teamsRoutes = BaseRouter();

teamsRoutes.use(requireAuth);

/**
 * Get routes
 */

teamsRoutes.get(
    '/',
    requireAdmin,
    requireFiltersOrPagination,
    teamController.findAll
);
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
    requireOwnerOrAdminTeam,
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
