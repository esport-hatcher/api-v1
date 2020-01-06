import { BaseRouter } from '@services/router';
import { seeder } from '@controllers';
import { requireStagingOrDevEnv } from '@middlewares';

const jobRoutes = BaseRouter();

jobRoutes.get('/seeders', requireStagingOrDevEnv, seeder);

export { jobRoutes };
