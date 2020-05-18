import { IRequest } from '@typings';

const convertUrlToAction = (raw: string): string => {
    const actionPart: Array<string> = raw.split('/');

    actionPart.forEach((value, index) => {
        if (value !== '') {
            let tmpAction = '.' + value + '.';

            tmpAction = tmpAction.replace(/(\.\d+\.)/g, '._.');
            tmpAction = tmpAction.replace(/(^\.)/g, '');
            tmpAction = tmpAction.replace(/(\.$)/g, '');
            actionPart[index] = tmpAction;
        }
    });

    return actionPart.join('.');
};

export const retrieveActionFromPath = (req: IRequest): string => {
    let action: string;

    action = req.method.toString().toLowerCase();
    action += convertUrlToAction(req.originalUrl.replace(/-/g, '_'));

    return action;
};
