import PrismaInventoryRepository from "#/infrastructure/persistence/repositories/PrismaInventoryRepository.js";
import { container } from "tsyringe";
import ItemController from "../controllers/Item.js";
import ItemModel from "../models/Item.js";
import SequenceModel from "../models/Sequence.js";
import ItemRouter from "../routers/Item.js";
import IdGeneratorService from "../services/IdGenerator.js";
import ItemService from "../services/Item.js";
import {
  DateTimeFormatter,
  DigitFormatter,
  HexFormatter,
} from "../services/partIdFormatters.js";

import {
  BitRandomNumberGenerator,
  DateTimeGenerator,
  GuidGenerator,
  RandomNumberGenerator,
  SequenceGenerator,
  TextGenerator,
} from "../services/partIdGenerators.js";
import ItemValidator from "../validators/Item.js";

export default class ItemModule {
  public readonly router: ItemRouter;

  constructor() {
    this.router = this.init();
  }

  private init() {
    const sequenceModel = new SequenceModel();
    const idGenerator = new IdGeneratorService(
      {
        DATETIME: new DateTimeGenerator(),
        GUID: new GuidGenerator(),
        RANDOM20: new BitRandomNumberGenerator(20),
        RANDOM32: new BitRandomNumberGenerator(32),
        RANDOM6: new RandomNumberGenerator(6),
        RANDOM9: new RandomNumberGenerator(9),
        SEQUENCE: new SequenceGenerator(sequenceModel),
        TEXT: new TextGenerator(),
      },
      [new DateTimeFormatter(), new DigitFormatter(), new HexFormatter()],
    );
    const itemModel = new ItemModel(idGenerator);
    const invRepo = container.resolve(PrismaInventoryRepository);
    const itemService = new ItemService(itemModel, invRepo);
    const itemController = new ItemController(itemService);
    return new ItemRouter(itemController, new ItemValidator());
  }
}
