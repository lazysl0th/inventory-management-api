type TResource = "inventory";
type TScope = "comments";

interface IChannelProps {
  resource: TResource;
  resourceId: number | null;
  scope: TScope;
}

export default class Channel {
  public readonly resource: TResource;
  public readonly resourceId: string | null;
  public readonly scope: TScope;

  constructor(props: IChannelProps) {
    this.resource = props.resource;
    this.resourceId = props.resourceId ? props.resourceId.toString() : null;
    this.scope = props.scope;
  }

  get name(): string {
    return `${this.resource}:${this.resourceId}:${this.scope}`;
  }

  public toJSON() {
    return { name: this.name };
  }
}
