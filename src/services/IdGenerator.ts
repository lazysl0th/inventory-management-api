import {
  EnumCustomIdPartType,
  type ICustomIdFormatPart,
  type TCustomIdPartFormat,
} from "../types/models/Inventory.js";
import type { IPartIdGenerator } from "../types/services/PartIdGenerator.js";
import type { IIdGenerator } from "../types/services/IdGenerator.js";
import type { IPartIdFormatter } from "../types/services/PartIdFormatter.js";
import type { TransactionClient } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";

export default class IdGeneratorService implements IIdGenerator {
  private readonly partIdFormatters: Map<string, IPartIdFormatter>;
  private readonly partIdGenerators: Record<
    EnumCustomIdPartType,
    IPartIdGenerator
  >;

  constructor(
    partIdGenerators: Record<EnumCustomIdPartType, IPartIdGenerator>,
    partIdFormatters: IPartIdFormatter[],
  ) {
    this.partIdGenerators = partIdGenerators;
    this.partIdFormatters = new Map(
      partIdFormatters.flatMap((partIdformatter) =>
        partIdformatter.formats.map((format) => [format, partIdformatter]),
      ),
    );
  }

  async _generatePartId(
    part: ICustomIdFormatPart,
    tx: TransactionClient,
  ): Promise<string | number | bigint | Date> {
    if (part.type === EnumCustomIdPartType.TEXT && part.format)
      return part.format;
    const idGenerator = this.partIdGenerators[part.type];
    return part.type === EnumCustomIdPartType.SEQUENCE
      ? await idGenerator.generate(part.guid, tx)
      : await idGenerator.generate();
  }

  _formatPartId(
    id: string | number | bigint | Date,
    format: TCustomIdPartFormat,
  ) {
    if (!format) return id;
    const idFormatter = this.partIdFormatters.get(format);
    return idFormatter ? idFormatter.format(id, format) : id;
  }

  async generateCustomId(
    customIdParts: ICustomIdFormatPart[],
    tx: TransactionClient,
  ): Promise<string> {
    const generatedParts = await Promise.all(
      customIdParts.map(async (part) => {
        const id = await this._generatePartId(part, tx);
        const formatedId = this._formatPartId(id, part.format);
        return part.position === "prefix"
          ? `${part.separator ?? ""}${formatedId}`
          : `${formatedId}${part.separator ?? ""}`;
      }),
    );
    return generatedParts.join("");
  }
}
