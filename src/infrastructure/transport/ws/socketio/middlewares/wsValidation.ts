import { z } from "zod";
import { Socket } from "socket.io";

type TSocketPacketMiddleware = Parameters<Socket["use"]>[0];

export type TWsValidationRegistry = Record<string, z.ZodSchema>;

export const wsValidate =
  (validationRegistry: TWsValidationRegistry): TSocketPacketMiddleware =>
  (packet, next) => {
    const [eventName, payload] = packet;

    const schema = validationRegistry[eventName];

    if (!schema) {
      return next();
    }

    const result = schema.safeParse(payload);

    if (!result.success) {
      return next(new Error(`Invalid input: ${result.error.message}`));
    }
    packet[1] = result.data;
    next();
  };
