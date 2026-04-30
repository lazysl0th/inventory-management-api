import TagController from "../controllers/Tag.js";
import TagModel from "../models/Tag.js";
import TagRouter from "../routers/Tag.js";
import TagService from "../services/Tag.js";

export default class TagModule {
    public readonly router: TagRouter;

    constructor() {
        this.router = this.init();
    }
    private init() {
        const service = new TagService(new TagModel());
        const controller = new TagController(service);
        return new TagRouter(controller);
    }
}