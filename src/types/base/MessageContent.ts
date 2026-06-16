import { CONTENT_TAMPLATES } from "../../constants/email.js";

export type Params = Record<string, string>;

export interface ContentParams {
  subject?: Params;
  html?: Params;
  text?: Params;
}

export interface Content {
  subject: string;
  html: string;
  text: string;
}

export type MessageType = keyof typeof CONTENT_TAMPLATES;
