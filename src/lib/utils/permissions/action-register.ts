import * as express from 'express';
import { logger } from '@utils';
import { Action } from '@models';

interface IRouting {
    routes: Array<string>;
    methods: Array<string>;
    regexp: Array<string>;
    actions: Array<string>;
}

const retrieveRoutes = (app: express.Application): IRouting => {
    const data: IRouting = {
        routes: [],
        methods: [],
        regexp: [],
        actions: null,
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

const purifyRegexpName = (data: IRouting): IRouting => {
    data.regexp.forEach((expression, index) => {
        let tmp_expression: string;

        tmp_expression = expression.replace('/^\\', '');
        tmp_expression = tmp_expression.replace('?(?=\\/|$)/i', '');
        tmp_expression = tmp_expression.replace(/-/g, '_');
        tmp_expression = tmp_expression.split('/(?:([^\\/]+?))\\').join('_\\');
        tmp_expression = tmp_expression.split('/').join('');

        tmp_expression = removeLastCharByOccurence(tmp_expression, '\\');
        data.regexp[index] = tmp_expression;
    });

    return data;
};

const purifyRouteName = (routes: Array<string>): Array<string> => {
    routes.forEach((route, index) => {
        let tmp_route: string;

        tmp_route = route.replace(/(:\w+)/g, '_');
        tmp_route = tmp_route.replace(/-/g, '_');
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
    let data: IRouting = retrieveRoutes(app);

    data.routes = purifyRouteName(data.routes);
    data = purifyRegexpName(data);
    data.actions = setupActionNames(data);

    data.actions.forEach(async action => {
        await Action.findCreateFind({
            where: {
                action: action,
                label: action,
                requireTeam: action.includes('teams._') ? true : false,
                requireAuth: false,
            },
        })
            .then(actionResult => {
                if (actionResult[1] === true) {
                    logger(
                        'ActionRegister',
                        'Created ' + actionResult[0].label
                    );
                }

                return null;
            })
            .catch(error => {
                throw error;
            });
    });
};
