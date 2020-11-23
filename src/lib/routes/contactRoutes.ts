import { BaseRouter } from '@services/router';
import { contactController } from '@controllers';
import { requireAuth, requireFiltersOrPagination } from '@middlewares';

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

contactRoutes.get('/:contactId', requireAuth, contactController.findById);

contactRoutes.patch('/:contactId', requireAuth, contactController.updateById);

contactRoutes.delete(
    '/:contactId',
    requireAuth,
    requireFiltersOrPagination,
    contactController.deleteById
);

export { contactRoutes };
