import { randomBytes } from 'crypto';

export const createHashtag = () => {
    const buf = randomBytes(3);
    return `#${buf.toString('hex').toUpperCase()}`;
};
