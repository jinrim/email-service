import {
  Controller,
  Logger,
  Get,
  Response,
  Post,
  Body,
  NotImplementedException,
} from "@nestjs/common";
import { Response as ExpressResponse } from "express";
import { MainService } from "./main.service";
import { CheckerService } from "./services/email_checker/service";
import { EmailServiceParamsDTO } from "./dto";
import { PromMonit } from "@dnamicro/service-common/build/utils/decorators";

const client = require("prom-client");
client.collectDefaultMetrics({ timeout: 5000 });
global.prom_client = client;

const {
  EMAIL_CHECKING_INTERVAL = "3000",
  DATABASE = "gorentals",
  OUTBOX_ENTITY_NAME = "email_outbox",
  ENABLE_EMAIL_CHECKER = "false",
  SCHEMA_VERSION = "v4",
} = process.env;
@Controller()
export class MainController {
  private logger: Logger;
  constructor(
    private checkerService: CheckerService,
    private mainService: MainService
  ) {
    this.logger = new Logger("MAIN:CONTROLLER");
  }

  onModuleInit() {
    if (ENABLE_EMAIL_CHECKER === "true") {
      if (!DATABASE)
        throw new NotImplementedException("Database should be specified.");
      this.checkerService.emailChecker(
        "CHECKING_EMAIL_INTERVAL",
        Number(EMAIL_CHECKING_INTERVAL),
        OUTBOX_ENTITY_NAME,
        SCHEMA_VERSION,
        DATABASE
      );
    }
  }

  @Get("/metrics")
  async monitor(@Response() res: any) {
    res.set("Content-Type", global.prom_client.register.contentType);
    const result = await global.prom_client.register.metrics();
    res.end(result);
  }

  // ignore default icon request
  @Get("/favicon.ico")
  async icon(@Response() res: ExpressResponse) {
    res.writeHead(200, { "Content-Type": "image/x-icon" });
    res.end();
    this.logger.log("favicon requested");
  }

  @Post("/send")
  @PromMonit({ client: global.prom_client })
  async sendEmail(@Body() body: EmailServiceParamsDTO) {
    return await this.mainService
      .sendEmailUsingSendGrid(body)
      .then((res: any) => res)
      .catch((err: any) => {
        this.logger.error(`Error: ${err.response.body.errors}`);
      });
  }
}
