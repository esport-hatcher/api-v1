import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    requireAuth,
    requireAdmin,
    requireScopeOrSuperAdmin,
    requireValidation,
    requireTeamOwnerOrAdmin,
    requireFiltersOrPagination,
    requireOwnerUserOrTeamAdmin,
    requireOwnerTeamMember,
} from '@middlewares';
import { teamController } from '@controllers';

const teamsRoutes = BaseRouter();

teamsRoutes.use(requireAuth);

teamsRoutes.get('/', requireFiltersOrPagination, teamController.findAll);

teamsRoutes.get('/:teamId', teamController.findById);

teamsRoutes.post(
    '/',
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 40 })
            .withMessage('Please enter a name between 5 and 40 characters'),
        body('game').trim().isLength({ min: 1 }),
        body('region').trim().isLength({ min: 2, max: 2 }),
    ],
    requireValidation,
    teamController.create
);

teamsRoutes.patch(
    '/:teamId',
    requireScopeOrSuperAdmin,
    teamController.updateById
);

teamsRoutes.delete(
    '/:teamId',
    requireScopeOrSuperAdmin,
    teamController.deleteById
);

/**
 * Routes related to team members
 */

teamsRoutes.get(
    '/:teamId/users',
    requireAuth,
    requireOwnerTeamMember,
    teamController.getTeamUser
);

teamsRoutes.post(
    '/:teamId/users/:userId',
    requireValidation,
    requireTeamOwnerOrAdmin,
    teamController.addTeamUser
);

teamsRoutes.patch(
    '/:teamId/users/:userId',
    requireOwnerUserOrTeamAdmin,
    teamController.patchTeamUser
);
export { teamsRoutes };
