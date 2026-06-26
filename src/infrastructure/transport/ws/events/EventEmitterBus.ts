import type {
  IEvent,
  IEventBus,
} from "#/application/services/realtime/interfaces/IEventBus.js";
import { EventEmitter } from "node:events";
import { singleton } from "tsyringe";

@singleton()
export class EventEmitterBus implements IEventBus {
  private emitter = new EventEmitter();

  async publish<T>(event: IEvent<T>): Promise<void> {
    setImmediate(() => {
      this.emitter.emit(event.eventName, event.payload);
    });
  }

  subscribe<T>(
    eventName: string,
    handler: (payload: T) => Promise<void>,
  ): void {
    this.emitter.on(eventName, async (payload) => {
      try {
        await handler(payload);
      } catch (err) {
        console.error(`[EventBus] Ошибка в обработчике ${eventName}:`, err);
      }
    });
  }
}
