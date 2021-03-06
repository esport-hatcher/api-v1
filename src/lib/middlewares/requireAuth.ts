import { authenticate } from 'passport';
// tslint:disable-next-line: no-floating-promises
import('@services/passport');

// Middleware to check if the user is logged in or not

export const requireAuth = authenticate('jwt', {
    session: false,
    assignProperty: 'owner',
});
