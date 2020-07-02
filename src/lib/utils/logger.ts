import { inspect } from 'util';

// const { LOGGER } = process.env;
const LOGGER = true;

export const logger = (about: string, msg: string, object: Object = null) => {
    if (LOGGER) {
        // tslint:disable-next-line: no-console
        console.log(`[${about}] => ${msg}.`);

        if (object) {
            const stringObject: string = inspect(object, false, null, true);
            // tslint:disable-next-line: no-console
            console.log(`${stringObject}`);
        }
    }
};

export const debug = (msg: string, object: Object = null) => {
    if (LOGGER && object) {
        const stringObject: string = inspect(object, false, null, true);
        // tslint:disable-next-line: no-console
        console.log(`[DEBUG] ${msg}\n${stringObject ? stringObject : ''}`);
    }
};
