export interface ITagProps {
  id: string;
  name: string;
  count: number;
}

export default class Tag {
  readonly id: string;
  readonly name: string;
  readonly count: number;

  constructor(props: ITagProps) {
    this.id = props.id;
    this.name = props.name;
    this.count = props.count;
  }

  public toJSON(): ITagProps {
    return {
      id: this.id,
      name: this.name,
      count: this.count,
    };
  }
}
