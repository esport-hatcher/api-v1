import { authenticate } from 'passport';
import('@services/passport');

// Middleware to check if the user is logged in or not

export default authenticate('jwt', { session: false });
