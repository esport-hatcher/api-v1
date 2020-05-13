export const logger = (about: string, msg: string) => {
    const { LOGGER } = process.env;

    if (LOGGER) {
        // tslint:disable-next-line: no-console
        console.log(`[${about}] => ${msg}.`);
    }
};
