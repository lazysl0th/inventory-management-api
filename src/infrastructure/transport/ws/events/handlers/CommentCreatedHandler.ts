import { inject, singleton } from "tsyringe";
import Channel from "#/domain/value-objects/Channel.js";
import type Comment from "#/domain/entities/Comment.js";
import type { IEventBus } from "#/application/services/realtime/interfaces/IEventBus.js";
import type { IRealtimePublisher } from "#/application/services/realtime/interfaces/IRealtimePublisher.js";

@singleton()
export class CommentCreatedHandler {
  constructor(
    @inject("EventBus") private readonly eventBus: IEventBus,
    @inject("RealtimePublisher")
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
