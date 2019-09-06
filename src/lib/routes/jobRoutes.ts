import { Router } from 'express';
import { seeder } from '@controllers/jobController';
import { requireStagingOrDevEnv } from '@middlewares';

const jobRoutes = Router();

jobRoutes.get('/seeders', requireStagingOrDevEnv, seeder);

export default jobRoutes;