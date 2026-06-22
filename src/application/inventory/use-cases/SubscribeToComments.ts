import { inject, injectable } from "tsyringe";
import type { ISubscriptionManager } from "../../realtime/interfaces/ISubscriptionManager.js";
import type { IInventoryModel } from "../../../types/models/Inventory.js";
import type { ISubscribeToCommentsCommand } from "../dtos/WSInventoryDto.js";
import NotFound from "#/domain/errors/NotFound.js";
import Channel from "#/domain/value-objects/Channel.js";
import type { ISessionRepository } from "#/application/realtime/interfaces/ISessionRepository.js";

@injectable()
export default class SubscribeToComments {
  constructor(
    @inject("SubscriptionManager")
    private readonly subscriptionManager: ISubscriptionManager,
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryModel,
    @inject("SessionRepository")
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(command: ISubscribeToCommentsCommand): Promise<Channel> {
    const inventory = await this.inventoryRepository.getById(
      Number(command.inventoryId),
    );
    if (!inventory) {
      throw new NotFound("Inventory not found");
    }
    const channel = new Channel({
      resource: "inventory",
      resourceId: inventory.id,
      scope: "comments",
    });
    await this.subscriptionManager.subscribe(command.sessionId, channel.name);
    await this.sessionRepository.addChannel(command.sessionId, channel.name);
    console.log(
      `[Socket.IO] [SubscribeToChannel] Session ${command.sessionId} added in ${channel.name}`,
    );
    return channel;
  }
}
