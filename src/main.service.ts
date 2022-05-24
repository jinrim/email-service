import { Injectable, Logger } from "@nestjs/common";
import sendGrid from "sendgrid";

import {
  IEmailServiceConfig,
  IEmailServiceParams,
  IReceiverBody,
  IEmailServiceResponse,
} from "./main.type";

const {
  // DEFAULT_EMAIL_TO = "hanna@dnamicro.com",
  DEFAULT_EMAIL_FROM = "noreply@dnamicro.com",
  SENDGRID_API_KEY = "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",
} = process.env;

@Injectable()
export class MainService {
  private sendgrid: any;
  private logger: Logger;
  constructor() {
    this.sendgrid = sendGrid(SENDGRID_API_KEY);
    this.logger = new Logger("MAIN:SERVICE");
  }

  async sendEmailUsingSendGrid(
    params: IEmailServiceParams
  ): Promise<IEmailServiceResponse> {
    const {
      subject,
      email_to,
      email_from,
      name_from,
      body,
      attachments,
    } = params;

    let config: IEmailServiceConfig = {
      method: "POST",
      path: "/v3/mail/send",
      body: {
        personalizations: [
          {
            to: email_to.reduce((acc: IReceiverBody[], email: string) => {
              return [...acc, { email }];
            }, []),
            subject: subject ?? "",
          },
        ],
        from: {
          email: email_from ?? DEFAULT_EMAIL_FROM,
          name: name_from ?? "",
        },
        content: [
          {
            type: "text/html",
            value: body,
          },
        ],
      },
    };

    if (attachments && attachments.length > 0)
      config.body.attachments = attachments;

    const request = this.sendgrid.emptyRequest(config);
    this.logger.log(request);
    return await this.sendgrid.API(request);
  }
}
