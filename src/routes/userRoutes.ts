import { Router } from 'express';
import { body } from 'express-validator/check';
import * as authController from '../controllers/userController';
import validateRequest from '../middlewares/validateRequest';

const router = Router();

router.post(
	'/',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email'),
		body('password')
			.trim()
			.isLength({ min: 5, max: 20 })
			.withMessage('Please enter a password between 5 and 20 characters')
	],
	validateRequest,
	authController.register
);

export default router;
