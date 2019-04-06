import * as passport from 'passport';
require('../services/passport');

// Middleware to check if the user is logged in or not

export default passport.authenticate('jwt', { session: false });
