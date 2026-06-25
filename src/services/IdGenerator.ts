import type { IPartIdGenerator } from "../types/services/PartIdGenerator.js";
import type { IIdGenerator } from "../types/services/IdGenerator.js";
import type { IPartIdFormatter } from "../types/services/PartIdFormatter.js";
import type { TransactionClient } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";
import type {
  TCustomIdPartFormat,
  TCustomIdPartType,
} from "#/domain/value-objects/CustomIdFormatPart.js";
import type CustomIdFormatPart from "#/domain/value-objects/CustomIdFormatPart.js";

export default class IdGeneratorService implements IIdGenerator {
  private readonly partIdFormatters: Map<string, IPartIdFormatter>;
  private readonly partIdGenerators: Record<
    TCustomIdPartType,
    IPartIdGenerator
  >;

  constructor(
    partIdGenerators: Record<TCustomIdPartType, IPartIdGenerator>,
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
    part: CustomIdFormatPart,
    tx: TransactionClient,
  ): Promise<string | number | bigint | Date> {
    if (part.type === "TEXT" && part.format) return part.format;
    const idGenerator = this.partIdGenerators[part.type];
    return part.type === "SEQUENCE"
      ? await idGenerator.generate(part.id, tx)
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
    customIdParts: CustomIdFormatPart[],
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
