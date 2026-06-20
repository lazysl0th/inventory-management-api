import { Socket } from "socket.io";
import type WSInventoryController from "./WSInventoryController.js";
import {
  type TInventoryCommentsSubscribeDto,
  type TInventoryCommentsUnsubscribeDto,
} from "#/application/inventory/dtos/WSInventoryDto.js";
import { catchAsync } from "../../middlewares/catchAsync.js";

const wsInventoryRoutes = (
  socket: Socket,
  wsInventoryController: WSInventoryController,
) => {
  socket.on(
    "inventory:comments:subscribe",
    catchAsync(
      socket,
      async (data: TInventoryCommentsSubscribeDto, callback) => {
        const channel =
          await wsInventoryController.subscribeToInventoryComments({
            sessionId: socket.id,
            data,
          });
        if (callback) callback({ status: "ok", channel });
      },
    ),
  );

  socket.on(
    "inventory:comments:unsubscribe",
    catchAsync(
      socket,
      async (data: TInventoryCommentsUnsubscribeDto, callback) => {
        await wsInventoryController.unsubscribeFromInventoryComments({
          sessionId: socket.id,
          data,
        });
        if (callback) callback({ status: "ok" });
      },
    ),
  );
};

export default wsInventoryRoutes;
