import { json } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

import User from '@models/User';
import Teams from '@models/Teams';

// Routes
import userRoutes from '@routes/userRoutes';
import teamsRoutes from '@routes/teamsRoutes';
import IError from '@typings/general/IError';
import IRequest from '@typings/general/IRequest';

// Express app creation
const app = express();

// CORS configuring + parser for requests
app.use(cors());
app.use(json());

// Redirect every url beginning by auth to authRoutes
app.use('/users', userRoutes);
app.use('/teams', teamsRoutes);

// Healthcheck route
app.get('/', (req, res) => {
    // tslint:disable-next-line: no-unused-expression
    req;
    return res
        .status(200)
        .json({ success: 'Esport-Hatcher {API v1.0} is live' });
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

User.hasOne(Teams);
Teams.belongsTo(User);

export default app;
