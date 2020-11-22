import { BaseRouter } from '@services/router';
import { contactController } from '@controllers';
import {
    requireAuth,
    requireFiltersOrPagination,
    requireTeamOwnerOrAdmin,
} from '@middlewares';

const contactRoutes = BaseRouter();

contactRoutes.get(
    '/',
    requireAuth,
    requireFiltersOrPagination,
    contactController.findAll
);

contactRoutes.post(
    '/',
    requireAuth,
    requireFiltersOrPagination,
    contactController.create
);

contactRoutes.patch('/', requireTeamOwnerOrAdmin, contactController.updateById);

contactRoutes.delete(
    '/',
    requireAuth,
    requireFiltersOrPagination,
    contactController.deleteById
);

export { contactRoutes };
