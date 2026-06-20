import { Socket } from "socket.io";
import { handleSocketError } from "./handleSocketErrors.js";

export interface IBaseAckResponse {
  status: "ok" | "error";
  message?: string;
  [key: string]: unknown;
}

type TAckCallback = (response: IBaseAckResponse) => void;

function isAckCallback(value: unknown): value is TAckCallback {
  return typeof value === "function";
}

export const catchAsync = <Args extends unknown[]>(
  socket: Socket,
  handler: (...args: Args) => Promise<void>,
) => {
  return async (...args: Args): Promise<void> => {
    const lastArg = args[args.length - 1];
    const callback = isAckCallback(lastArg) ? lastArg : undefined;

    try {
      await handler(...args);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (callback) {
        callback({ status: "error", message: errorMessage });
      }
      handleSocketError(socket, error);
    }
  };
};
