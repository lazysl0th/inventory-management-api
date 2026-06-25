import z from "zod";

type TInventoryEvent =
  | "inventory:comments:subscribe"
  | "inventory:comments:unsubscribe";

type TInventoryValidationRegistry = Record<TInventoryEvent, z.ZodSchema>;

const inventoryCommentsSubscribeSchema = z.object({
  inventoryId: z.uuid(),
});

const inventoryCommentsUnsubscribeSchema = inventoryCommentsSubscribeSchema;

export const commentsValidationRegistry: TInventoryValidationRegistry = {
  "inventory:comments:subscribe": inventoryCommentsSubscribeSchema,
  "inventory:comments:unsubscribe": inventoryCommentsUnsubscribeSchema,
};

export type TInventoryCommentsSubscribeDto = z.infer<
  typeof inventoryCommentsSubscribeSchema
>;

export type TInventoryCommentsUnsubscribeDto = z.infer<
  typeof inventoryCommentsUnsubscribeSchema
>;

export interface ISubscribeToCommentsCommand {
  sessionId: string;
  inventoryId: z.infer<typeof inventoryCommentsSubscribeSchema>["inventoryId"];
}

export type TUnsubscribeFromCommentsCommand = ISubscribeToCommentsCommand;
