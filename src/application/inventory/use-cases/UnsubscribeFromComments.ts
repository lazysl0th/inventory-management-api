import { inject, injectable } from "tsyringe";
import type { ISubscriptionManager } from "../../realtime/interfaces/ISubscriptionManager.js";
import type { TUnsubscribeFromCommentsCommand } from "../dtos/WSInventoryDto.js";
import Channel from "#/domain/value-objects/Channel.js";
import type { ISessionRepository } from "#/application/realtime/interfaces/ISessionRepository.js";

@injectable()
export default class UnsubscribeFromComments {
  constructor(
    @inject("SubscriptionManager")
    private readonly subscriptionManager: ISubscriptionManager,
    @inject("SessionRepository")
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(command: TUnsubscribeFromCommentsCommand): Promise<void> {
    const channel = new Channel({
      resource: "inventory",
      resourceId: Number(command.inventoryId),
      scope: "comments",
    });
    await this.subscriptionManager.unsubscribe(command.sessionId, channel.name);
    await this.sessionRepository.removeChannel(command.sessionId, channel.name);
    console.log(
      `[Socket.IO] [UnsubscribeFromChannel] Session ${command.sessionId} delete from ${channel.name}`,
    );
  }
}
