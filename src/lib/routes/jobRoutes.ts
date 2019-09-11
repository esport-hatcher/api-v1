import { Router } from 'express';
import { seeder } from '@controllers';
import { requireStagingOrDevEnv } from '@middlewares';

const jobRoutes: Router = Router();

jobRoutes.get('/seeders', requireStagingOrDevEnv, seeder);

export { jobRoutes };
