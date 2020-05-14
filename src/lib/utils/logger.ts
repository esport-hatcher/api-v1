import { inspect } from 'util';

export const logger = (about: string, msg: string, object: Object = null) => {
    // tslint:disable-next-line: no-console
    console.log(`[${about}] => ${msg}.`);

    if (object) {
        const stringObject: string = inspect(object, false, null, true);
        // tslint:disable-next-line: no-console
        console.log(`${stringObject}`);
    }
};
