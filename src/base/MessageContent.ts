import { CONTENT_TAMPLATES } from "../constants/email.js";
import type {
  Content,
  ContentParams,
  MessageType,
  Params,
} from "../types/base/MessageContent.js";
import { replaceParamsInTemplate } from "../utils.js";

export default abstract class MessageContent {
  static type: MessageType;

  private static _getSubject(params?: Params): string {
    return params
      ? replaceParamsInTemplate(params, CONTENT_TAMPLATES[this.type].SUBJECT)
      : CONTENT_TAMPLATES[this.type].SUBJECT;
  }

  private static _getHtml(params?: Params): string {
    return params
      ? replaceParamsInTemplate(params, CONTENT_TAMPLATES[this.type].HTML)
      : CONTENT_TAMPLATES[this.type].HTML;
  }

  private static _getText(params?: Params): string {
    return params
      ? replaceParamsInTemplate(params, CONTENT_TAMPLATES[this.type].TEXT)
      : CONTENT_TAMPLATES[this.type].TEXT;
  }

  static getContent(params?: ContentParams): Content {
    return {
      subject: params?.subject
        ? this._getSubject(params?.subject)
        : this._getSubject(),
      html: params?.html ? this._getHtml(params?.html) : this._getHtml(),
      text: params?.text ? this._getText(params?.text) : this._getText(),
    };
  }
}
