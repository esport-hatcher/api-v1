import { Router } from 'express';
import { body } from 'express-validator/check';
import userController from '@controllers/userController';
import validateRequest from '@middlewares/validateRequest';
import requireAuth from '@middlewares/requireAuth';
import requireAdmin from '@middlewares/requireAdmin';

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
    validateRequest,
    userController.register
);

userRoutes.post(
    '/token',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email'),
    ],
    validateRequest,
    userController.getToken
);

userRoutes.get('/', requireAuth, requireAdmin, userController.findAll);
userRoutes.get('/:userID', requireAuth, userController.findById);

userRoutes.post(
    '/email',
    [body('email').isEmail()],
    validateRequest,
    userController.checkIfEmailIsAvailable
);

userRoutes.patch('/:userID', requireAuth, userController.updateById);

userRoutes.delete('/:userID', requireAuth, userController.deleteById);

export default userRoutes;
