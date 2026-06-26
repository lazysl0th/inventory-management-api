type TSocialProvider = "google" | "facebook";

interface ISocialAccountProps {
  provider: TSocialProvider;
  providerId: string;
}

export class SocialAccount {
  public readonly provider: TSocialProvider;
  public readonly providerId: string;
  constructor(props: ISocialAccountProps) {
    this.provider = props.provider;
    this.providerId = props.providerId;
  }
}
