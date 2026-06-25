export const ITEM_SELECT = {
  id: true,
  inventoryId: true,
  customId: true,
  ownerId: true,
  owner: { select: { id: true, name: true, email: true } },
  version: true,
  createdAt: true,
  updatedAt: true,
  values: { select: { id: true, field: true, value: true } },
} as const;
