import { use } from 'passport';
import { StrategyOptions, ExtractJwt, Strategy } from 'passport-jwt';
import User from '@models/User';
import * as keys from '@config/keys';

const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwtSecret,
};

const jwtLogin = new Strategy(jwtOptions, async (payload: any, done: any) => {
    const user = await User.findByPk(payload.sub);
    if (!user) {
        return done(null, false);
    }
    return done(null, user);
});

/*
Equivalent to passport.use
**/
use(jwtLogin);
