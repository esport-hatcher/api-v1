export const createHashtag = () => {
    const res = Math.floor(1000 + Math.random() * 9000);
    return `#${res}`;
};
