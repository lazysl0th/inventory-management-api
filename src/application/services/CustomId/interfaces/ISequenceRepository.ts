export interface ISequenceRepository {
  getCurrentValue(partGuid: string): Promise<number>;
}
