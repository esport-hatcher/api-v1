export const logger = (about: string, msg: string) => {
    // tslint:disable-next-line: no-console
    console.log(`[${about}] => ${msg}.`);
};
