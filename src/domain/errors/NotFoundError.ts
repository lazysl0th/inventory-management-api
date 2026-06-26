import DomainError from "./DomainError.js";

export type TEntity =
  | "User"
  | "Inventory"
  | "Item"
  | "Sequence"
  | "CustomIdGenerator"
  | "CustomIdFormatter";

export default class NotFoundError extends DomainError {
  readonly code: string;

  constructor(entityName: TEntity) {
    super(`${entityName} was not found.`);
    this.code = `${entityName.toUpperCase()}_NOT_FOUND`;
  }
}
