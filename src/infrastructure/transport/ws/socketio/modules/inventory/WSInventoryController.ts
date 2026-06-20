import SubscribeToComments from "#/application/inventory/use-cases/SubscribeToComments.js";
import UnsubscribeFromComments from "#/application/inventory/use-cases/UnsubscribeFromComments.js";
import { inject, singleton } from "tsyringe";
import type {
  TInventoryCommentsSubscribeDto,
  TInventoryCommentsUnsubscribeDto,
} from "#/application/inventory/dtos/WSInventoryDto.js";
import type Channel from "#/domain/value-objects/Channel.js";

export interface ISubscribeToInventoryCommentsPayload {
  sessionId: string;
  data: TInventoryCommentsSubscribeDto;
}

export interface IUnsubscribeToInventoryCommentsPayload {
  sessionId: string;
  data: TInventoryCommentsUnsubscribeDto;
}

@singleton()
export default class WSInventoryController {
  constructor(
    @inject(SubscribeToComments)
    private readonly subscribe: SubscribeToComments,
    @inject(UnsubscribeFromComments)
    private readonly unsubscribe: UnsubscribeFromComments,
  ) {}

  async subscribeToInventoryComments(
    payload: ISubscribeToInventoryCommentsPayload,
  ): Promise<Channel> {
    return await this.subscribe.execute({
      sessionId: payload.sessionId,
      inventoryId: payload.data.inventoryId,
    });
  }

  async unsubscribeFromInventoryComments(
    payload: IUnsubscribeToInventoryCommentsPayload,
  ): Promise<void> {
    await this.unsubscribe.execute({
      sessionId: payload.sessionId,
      inventoryId: payload.data.inventoryId,
    });
  }
}
