import { body } from 'express-validator/check';
import { BaseRouter } from '@services/router';
import {
    userController,
    teamController,
    eventController,
    taskController,
} from '@controllers';
import {
    requireValidation,
    requireScopeOrSuperAdmin,
    requireAuth,
    requireFiltersOrPagination,
    requirePersonalEvent,
    requirePersonalTask,
    requireOwnerPartOfEvent,
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

userRoutes.get('/:userId', requireAuth, userController.findById);

/**
 * Post routes
 */
userRoutes.post(
    '/',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password')
            .trim()
            .isLength({ min: 5, max: 20 })
            .withMessage('Please enter a password between 5 and 20 characters'),
        body('firstName').trim().isString(),
        body('lastName').trim().isString(),
        body('username').trim().isLength({ min: 2, max: 25 }),
    ],
    requireValidation,
    userController.create
);

userRoutes.post(
    '/token',
    [body('email').isEmail().withMessage('Please enter a valid email')],
    requireValidation,
    userController.getToken
);

userRoutes.post(
    '/email',
    [body('email').isEmail()],
    requireValidation,
    userController.checkIfEmailIsAvailable
);

userRoutes.post('/reset-password', userController.resetPassword);

userRoutes.post(
    '/change-password',
    requireValidation,
    userController.changePassword
);

userRoutes.post(
    '/:userId/teams/:teamId',
    requireValidation,
    requireAuth,
    userController.userJoinTeam
);

userRoutes.get(
    '/:userId/teams',
    requireAuth,
    requireScopeOrSuperAdmin,
    teamController.findAllByUser
);

/**
 * Patch routes
 */
userRoutes.patch(
    '/:userId',
    requireAuth,
    requireScopeOrSuperAdmin,
    userController.updateById
);

/**
 * Delete routes
 */
userRoutes.delete(
    '/:userId',
    requireAuth,
    requireScopeOrSuperAdmin,
    userController.deleteById
);

/** EVENTS */
userRoutes.post(
    '/:userId/events',
    requireAuth,
    [
        body('title').trim().isLength({ min: 1 }),
        body('description').trim().isLength({ min: 1 }),
        body('place').trim().isLength({ min: 1, max: 50 }),
        body('dateBegin').trim(),
        body('dateEnd').trim(),
    ],
    requireValidation,
    requireScopeOrSuperAdmin,
    eventController.create
);

userRoutes.get(
    '/:userId/events',
    requireAuth,
    requireScopeOrSuperAdmin,
    requireFiltersOrPagination,
    eventController.findAllByUser
);

userRoutes.get(
    '/:userId/events/:eventId',
    requireAuth,
    requireScopeOrSuperAdmin,
    requireOwnerPartOfEvent,
    eventController.findById
);

userRoutes.patch(
    '/:userId/events/:eventId',
    requireAuth,
    requireScopeOrSuperAdmin,
    requirePersonalEvent,
    eventController.updateById
);

userRoutes.delete(
    '/:userId/events/:eventId',
    requireAuth,
    requireScopeOrSuperAdmin,
    requirePersonalEvent,
    eventController.deleteById
);

/** TASKS */
userRoutes.post(
    '/:userId/tasks',
    requireAuth,
    requireScopeOrSuperAdmin,
    taskController.create
);

userRoutes.get(
    '/:userId/tasks',
    requireAuth,
    requireScopeOrSuperAdmin,
    taskController.findAllByUser
);

userRoutes.get(
    '/:userId/tasks/:taskId',
    requireAuth,
    requireScopeOrSuperAdmin,
    requirePersonalTask,
    taskController.findById
);

userRoutes.patch(
    '/:userId/tasks/:taskId',
    requireAuth,
    requireScopeOrSuperAdmin,
    requirePersonalTask,
    taskController.updateById
);

userRoutes.delete(
    '/:userId/tasks/:taskId',
    requireAuth,
    requireScopeOrSuperAdmin,
    requirePersonalTask,
    taskController.deleteById
);

export { userRoutes };
