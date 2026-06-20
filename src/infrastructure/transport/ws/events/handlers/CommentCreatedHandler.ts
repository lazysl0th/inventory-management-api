import { inject, singleton } from "tsyringe";
import type { IEventBus } from "#/application/realtime/interfaces/IEventBus.js";
import type { IRealtimePublisher } from "#/application/realtime/interfaces/IRealtimePublisher.js";
import Channel from "#/domain/value-objects/Channel.js";
import type Comment from "#/domain/entities/Comment.js";

@singleton()
export class CommentCreatedHandler {
  constructor(
    @inject("IEventBus") private readonly eventBus: IEventBus,
    @inject("IRealtimePublisher")
    private readonly publisher: IRealtimePublisher<Comment>,
  ) {
    this.init();
  }

  private init() {
    this.eventBus.subscribe("COMMENT_CREATED", async (comment: Comment) => {
      const channel = new Channel({
        resource: "inventory",
        resourceId: comment.inventoryId,
        scope: "comments",
      });
      await this.publisher.publishToChannel(
        channel.name,
        "COMMENT_CREATED",
        comment,
      );
    });
  }
}
