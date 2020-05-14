import * as express from 'express';
import { logger } from '@utils';

interface IRouting {
    routes: Array<string>;
    methods: Array<string>;
    regexp: Array<string>;
    action: Array<string>;
}

const retrieveRoutes = (app: express.Application): IRouting => {
    const data: IRouting = {
        routes: [],
        methods: [],
        regexp: [],
        action: null,
    };

    app._router.stack.forEach(middleware => {
        if (middleware.name === 'router') {
            middleware.handle.stack.forEach(handler => {
                if (handler.route) {
                    data.regexp.push(middleware.regexp.toString());
                    data.routes.push(handler.route.path);
                    data.methods.push(Object.keys(handler.route.methods)[0]);
                }
            });
        }
    });

    return data;
};

const removeLastCharByOccurence = (str: string, occurence: string): string => {
    if (
        str.slice(str.length - occurence.length, str.length + 1) === occurence
    ) {
        return str.slice(0, str.length - occurence.length);
    }

    return str;
};

const purifyRegexpName = (regexp: Array<string>): Array<string> => {
    regexp.forEach((expression, index) => {
        let tmp_expression: string;

        tmp_expression = expression.replace('/^\\', '');
        tmp_expression = tmp_expression.replace('?(?=\\/|$)/i', '');
        tmp_expression = tmp_expression.split('/(?:([^\\/]+?))\\').join('_\\');
        tmp_expression = tmp_expression.split('/').join('');

        tmp_expression = removeLastCharByOccurence(tmp_expression, '\\');
        regexp[index] = tmp_expression;
    });

    return regexp;
};

const purifyRouteName = (routes: Array<string>): Array<string> => {
    routes.forEach((route, index) => {
        let tmp_route: string;

        tmp_route = route.replace(/(:)/g, '');
        tmp_route = tmp_route.replace(
            /[A-Z]/g,
            letter => `_${letter.toLowerCase()}`
        );
        tmp_route = tmp_route.replace('//', '/');

        if (tmp_route.charAt(0) === '/') {
            tmp_route = tmp_route.slice(1, tmp_route.length);
        }

        tmp_route = removeLastCharByOccurence(tmp_route, '/');
        routes[index] = tmp_route;
    });

    return routes;
};

const setupActionNames = (data: IRouting) => {
    const actions: Array<string> = [];

    data.methods.forEach((method, index) => {
        let action: string = method;

        if (data.regexp[index] !== '') {
            action += '.' + data.regexp[index].split('\\').join('.');
        }

        if (data.routes[index] !== '') {
            action += '.' + data.routes[index].split('/').join('.');
        }

        actions.push(action);
    });

    return actions;
};

export const registerActions = (app: express.Application) => {
    const data: IRouting = retrieveRoutes(app);

    data.routes = purifyRouteName(data.routes);
    data.regexp = purifyRegexpName(data.regexp);
    data.action = setupActionNames(data);

    logger('Actions', 'Display actions', data.action);
};
