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
import { EnumCustomIdPartType } from "../types/models/Inventory.js";
import type { IInventoryService } from "../types/services/Inventory.js";
import ItemValidator from "../validators/Item.js";

export default class ItemModule {
  public readonly router: ItemRouter;

  constructor(inventoryService: IInventoryService) {
    this.router = this.init(inventoryService);
  }

  private init(inventoryService: IInventoryService) {
    const sequenceModel = new SequenceModel();
    const idGenerator = new IdGeneratorService(
      {
        [EnumCustomIdPartType.DATETIME]: new DateTimeGenerator(),
        [EnumCustomIdPartType.GUID]: new GuidGenerator(),
        [EnumCustomIdPartType.RANDOM20]: new BitRandomNumberGenerator(20),
        [EnumCustomIdPartType.RANDOM32]: new BitRandomNumberGenerator(32),
        [EnumCustomIdPartType.RANDOM6]: new RandomNumberGenerator(6),
        [EnumCustomIdPartType.RANDOM9]: new RandomNumberGenerator(9),
        [EnumCustomIdPartType.SEQUENCE]: new SequenceGenerator(sequenceModel),
        [EnumCustomIdPartType.TEXT]: new TextGenerator(),
      },
      [new DateTimeFormatter(), new DigitFormatter(), new HexFormatter()],
    );
    const itemModel = new ItemModel(idGenerator);
    const itemService = new ItemService(itemModel, inventoryService);
    const itemController = new ItemController(itemService);
    return new ItemRouter(itemController, new ItemValidator());
  }
}
