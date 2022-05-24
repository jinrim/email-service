import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum ESendEmailStatus {
  SUCCESS = 202,
  BAD_REQUEST = 404,
  REQUIRES_AUTH = 401,
  ACCEPT_HEADER_MISSING = 406,
  TOO_MANY_REQUEST = 429,
  INTERNAL_SERVER_ERROR = 500,
}
export class EmailServiceParamsDTO {
  constructor() {
    this.subject = "";
    this.email_to = [];
    this.email_from = "";
    this.name_from = "";
    this.body = "";
    this.attachments = [];
  }

  @IsString()
  subject: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  email_to: string[];

  @IsString()
  email_from: string;

  @IsString()
  name_from: string;

  @IsString()
  body: string;

  @IsOptional()
  attachments: Record<string, any>[];
}
