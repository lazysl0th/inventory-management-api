import Router from "../base/Router.js";
import { NOT_FOUND } from "../constants/response.js";
import NotFound from "../errors/NotFound.js";
import type { IBaseRouter } from "../types/base/Router.js";

export default class IndexRouter extends Router {
    constructor(
        private readonly TagRouter: IBaseRouter,
        private readonly AuthRouter: IBaseRouter,
        private readonly UserRouter: IBaseRouter,
        private readonly UserRoleRouter: IBaseRouter,
        private readonly InventoryRouter: IBaseRouter,
        private readonly ItemRouter: IBaseRouter,
        private readonly CommentRouter: IBaseRouter,
        private readonly IntegrationRouter: IBaseRouter,
        
    ) {
        super();
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        this.router.use(this.AuthRouter.router);
        this.router.use('/users', this.UserRouter.router);
        this.router.use('/inventories', this.InventoryRouter.router);
        this.router.use('/inventories/:inventoryId/items', this.ItemRouter.router);
        this.router.use('/integration', this.IntegrationRouter.router);
        this.router.use('/tags', this.TagRouter.router);
        this.router.use('/comments', this.CommentRouter.router);
        this.router.use('/roles', this.UserRoleRouter.router);
        this.router.use((req, res, next) => next(new NotFound(NOT_FOUND.TEXT)));
    }
}