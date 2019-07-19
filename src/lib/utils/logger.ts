export default (about: string, msg: string) => {
    if (process.env.NODE_ENV !== 'CI') {
        // tslint:disable-next-line: no-console
        console.log(`[${about}] => ${msg}.`);
    }
};
