import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import { userController } from '@controllers';
import {
    requireValidation,
    requireScopeOrAdmin,
    requireAuth,
    requireFiltersOrPagination,
} from '@middlewares';

const userRoutes = BaseRouter();

/**
 * Get routes
 */
userRoutes.get(
    '/',
    requireAuth,
    requireFiltersOrPagination,
    userController.findAll
);

userRoutes.get('/me', requireAuth, userController.getMe);

userRoutes.get(
    '/:userId/organizations/:organizationId/teams',
    requireAuth,
    userController.getUserTeam
);
userRoutes.get('/:userId', requireAuth, userController.findById);

/**
 * Post routes
 */
userRoutes.post(
    '/',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email'),
        body('password')
            .trim()
            .isLength({ min: 5, max: 20 })
            .withMessage('Please enter a password between 5 and 20 characters'),
        body('firstName')
            .trim()
            .isString(),
        body('lastName')
            .trim()
            .isString(),
        body('username')
            .trim()
            .isLength({ min: 2, max: 25 }),
    ],
    requireValidation,
    userController.create
);

userRoutes.post(
    '/token',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email'),
    ],
    requireValidation,
    userController.getToken
);

userRoutes.post(
    '/email',
    [body('email').isEmail()],
    requireValidation,
    userController.checkIfEmailIsAvailable
);

userRoutes.post(
    '/:userId/organizations/:organizationId/teams/:teamId',
    [
        body('role')
            .trim()
            .withMessage('Please enter a role'),
    ],
    requireValidation,
    requireAuth,
    userController.userJoinTeam
);

/**
 * Patch routes
 */
userRoutes.patch(
    '/:userId',
    requireAuth,
    requireScopeOrAdmin,
    userController.updateById
);

/**
 * Delete routes
 */
userRoutes.delete(
    '/:userId',
    requireAuth,
    requireScopeOrAdmin,
    userController.deleteById
);

export { userRoutes };
