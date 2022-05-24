export interface IEmailServiceParams {
  subject: string;
  email_to: string[];
  email_from: string;
  name_from: string;
  body: string;
  attachments?: any[];
}

export interface IEmailServiceConfig {
  method: string;
  path: string;
  body: IEmailServiceConfigBody;
}

export interface IEmailServiceConfigBody {
  personalizations: IPersonalizations[];
  from: ISenderBody;
  content: IContentBody[];
  attachments?: any[];
}

export interface IPersonalizations {
  to: IReceiverBody[];
  subject: string;
}

export interface ISenderBody {
  email: string;
  name: string;
}

export interface IReceiverBody {
  email: string;
}

export interface IContentBody {
  type: string;
  value: string;
}

export interface IEmailServiceResponse {
  statusCode: number;
  body: string;
  headers: Record<string, any>;
}
