type TSocialProvider = "google" | "facebook";

interface ISocialAccountProps {
  id: string;
  provider: TSocialProvider;
  providerId: string;
}

export class SocialAccount {
  public readonly id: string;
  public readonly provider: TSocialProvider;
  public readonly providerId: string;
  constructor(props: ISocialAccountProps) {
    this.id = props.id;
    this.provider = props.provider;
    this.providerId = props.providerId;
  }
}
