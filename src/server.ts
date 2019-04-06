import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

// Db
import sequelize from './utils/database';

// Routes
import authRoutes from './routes/authRoutes';

const app = express();

// CORS configuring + parser for requests
app.use(cors());
app.use(bodyParser.json());

// Redirect every url beginning by auth to authRoutes
app.use('/auth', authRoutes);

// Error handler
app.use(
	(
		error: any,
		req: express.Request,
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

sequelize.sync().then(() => {
	app.listen(process.env.PORT_API, () => {
		console.log(process.env.NODE_ENV);
		console.log(`Server listening on ${process.env.PORT_API}`);
	});
});
