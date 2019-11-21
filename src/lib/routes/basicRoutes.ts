import { BaseRouter } from '@services/router';
import { requireAuth } from '@middlewares';
import { baseContoller } from '@controllers';

const basicRoutes = BaseRouter();

basicRoutes.get('/upload', requireAuth, baseContoller.upload);

export { basicRoutes };
