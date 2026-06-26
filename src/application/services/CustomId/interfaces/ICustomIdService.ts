import type CustomIdFormatPart from "#/domain/value-objects/CustomIdFormatPart.js";

export interface ICustomIdService {
  generate(customIdParts: CustomIdFormatPart[]): Promise<string>;
}
