import type { IPartIdGenerator } from "#/application/services/CustomId/interfaces/IPartIdGenerator.js";
import type { ISequenceRepository } from "#/application/services/CustomId/interfaces/ISequenceRepository.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class SequenceGenerator implements IPartIdGenerator {
  constructor(
    @inject("SequenceRepository")
    private readonly SequenceRepository: ISequenceRepository,
  ) {}

  async generate(sequenceId: string): Promise<number> {
    const currentValue =
      await this.SequenceRepository.getCurrentValue(sequenceId);
    if (!currentValue) throw new NotFoundError("Sequence");
    return currentValue;
  }
}
