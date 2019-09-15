import { use } from 'passport';
import {
    StrategyOptions,
    ExtractJwt,
    Strategy,
    VerifiedCallback,
} from 'passport-jwt';
import { User } from '@models';
import * as keys from '@config';

const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwtSecret,
};

const jwtLogin = new Strategy(
    jwtOptions,
    // tslint:disable-next-line: no-any
    async (payload: any, done: VerifiedCallback) => {
        const owner = await User.findByPk(payload.sub);
        if (!owner) {
            return done(null, false);
        }
        return done(null, owner);
    }
);

/*
Equivalent to passport.use
**/
use(jwtLogin);
