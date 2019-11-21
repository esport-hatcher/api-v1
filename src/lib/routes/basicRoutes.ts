import { BaseRouter } from '@services/router';
import { requireAuth } from '@middlewares';
import { baseContoller } from '@controllers';

const basicRoutes = BaseRouter();

basicRoutes.use(requireAuth);

basicRoutes.get('/upload', baseContoller.upload);
export { basicRoutes };
