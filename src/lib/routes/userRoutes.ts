import { Router } from 'express';
import { body } from 'express-validator/check';
import userController from '@controllers/userController';
import {
    requireValidation,
    requireScopeOrAdmin,
    requireAdmin,
    requireAuth,
} from '@middlewares';

const userRoutes = Router();

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
    userController.register
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

userRoutes.get('/', requireAuth, requireAdmin, userController.findAll);
userRoutes.get('/:userID', requireAuth, userController.findById);

/*
 ** route pour le smart-select côte front
 */
userRoutes.get('/findName/:userName', requireAuth, userController.findByName);

userRoutes.post(
    '/email',
    [body('email').isEmail()],
    requireValidation,
    userController.checkIfEmailIsAvailable
);

userRoutes.patch(
    '/:userID',
    requireAuth,
    requireScopeOrAdmin,
    userController.updateById
);

userRoutes.delete(
    '/:userID',
    requireAuth,
    requireScopeOrAdmin,
    userController.deleteById
);

export default userRoutes;
