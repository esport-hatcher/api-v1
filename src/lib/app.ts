import { json } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

// Routes
import {
    userRoutes,
    jobRoutes,
    clubRoutes,
    teamsRoutes,
    eventRoutes,
    userResolver,
    clubResolver,
    teamResolver,
    eventResolver,
    basicRoutes,
} from '@routes';
import { IError, IRequest } from '@typings';

// Express app creation
const app = express();

// CORS configuring + parser for requests
app.use(cors());
app.use(json());

// Redirect every url beginning by auth to authRoutes
app.param('userId', userResolver)
    .param('clubId', clubResolver)
    .param('teamId', teamResolver)
    .param('eventId', eventResolver);
app.use(basicRoutes);
app.use('/users', userRoutes);
app.use('/clubs', clubRoutes);
app.use('/clubs/:clubId/teams', teamsRoutes);
app.use('/jobs', jobRoutes);
app.use('/clubs/:clubId/teams/:teamId/events', eventRoutes);

// Healthcheck route
app.get('/', (req, res) => {
    // tslint:disable-next-line: no-unused-expression
    req;
    return res
        .status(200)
        .json({ success: 'Esport-Hatcher {API v1.1} is online' });
});

// Error handler
app.use(
    (
        error: IError,
        req: IRequest,
        res: express.Response,
        next: express.NextFunction
    ) => {
        req;
        next;
        const status = error.statusCode || 500;
        const message = error.message;
        const data = error.data;
        res.status(status).json({ message, data });
    }
);

export { app };
