import { Router } from 'express';
import { body } from 'express-validator/check';
import userController from '@controllers/userController';
import {
    requireValidation,
    requireScopeOrAdmin,
    requireAuth,
} from '@middlewares';

const userRoutes = Router();

/**
 * Get routes
 */
userRoutes.get('/', requireAuth, userController.findAll.bind(userController));

userRoutes.get(
    '/:userId',
    requireAuth,
    userController.findById.bind(userController)
);

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
        body('username')
            .trim()
            .isLength({ min: 2, max: 25 }),
    ],
    requireValidation,
    userController.create.bind(userController)
);

userRoutes.post(
    '/token',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email'),
    ],
    requireValidation,
    userController.getToken.bind(userController)
);

userRoutes.post(
    '/email',
    [body('email').isEmail()],
    requireValidation,
    userController.checkIfEmailIsAvailable.bind(userController)
);

/**
 * Patch routes
 */
userRoutes.patch(
    '/:userId',
    requireAuth,
    requireScopeOrAdmin,
    userController.updateById.bind(userController)
);

/**
 * Delete routes
 */
userRoutes.delete(
    '/:userId',
    requireAuth,
    requireScopeOrAdmin,
    userController.deleteById.bind(userController)
);

export default userRoutes;
