import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";

import { DefaultStoreService } from "@dnamicro/service-common/build/stores/default_store/service";
import { SearchService } from "../search_service/service";

import { ISearchParams, ISearchResults } from "../search_service/types";
import { MainService } from "../../main.service";
import { ESendEmailStatus } from "../../dto";

const { DEFAULT_EMAIL_FROM = "noreply@dnamicro.com" } = process.env;

@Injectable()
export class CheckerService {
  private schedulerRegistry: SchedulerRegistry;
  private searchService: SearchService;
  private mainService: MainService;
  private logger: Logger;
  private store: DefaultStoreService;
  constructor() {
    this.schedulerRegistry = new SchedulerRegistry();
    this.logger = new Logger("EMAIL_CHECKER:SERVICE");
    this.searchService = new SearchService();
    this.mainService = new MainService();
    this.store = new DefaultStoreService();
  }

  async emailChecker(
    name: string,
    milliseconds: number,
    entity_name: string,
    schema_version: string,
    database_name: string
  ) {
    const callback = async () => {
      const { data = {} }: ISearchResults = await this.getNotSentMailInOutbox(
        database_name,
        schema_version,
        entity_name
      );
      const { count = 0, results = [] } = data[entity_name] ?? {};
      if (count) {
        const [email_data] = results;
        const {
          id: email_id,
          subject,
          email_to,
          email_from,
          name_from,
          attachments,
          content = "",
          email_template: { content: email_template_content = "" } = {},
          version,
        } = email_data;

        if (!email_to.length) {
          this.logger.warn(
            `Field email_to in email with id [${email_id}] is missing.`
          );
          return;
        }

        if (email_from !== DEFAULT_EMAIL_FROM)
          throw new BadRequestException(
            `Field email_from should be "${DEFAULT_EMAIL_FROM}"`
          );

        const response = await this.mainService
          .sendEmailUsingSendGrid({
            subject,
            email_to,
            email_from,
            name_from,
            body: email_template_content ? email_template_content : content,
            attachments,
          })
          .then((res) => res)
          .catch((err: any) => {
            this.logger.error(
              `Error: ${JSON.stringify(err.response, null, 2)}`
            );
          });

        if (response?.statusCode === ESendEmailStatus.SUCCESS) {
          const { id, status } = await this.updateMailInOutbox(
            database_name,
            schema_version,
            entity_name,
            {
              id: email_id,
              status: "Sent",
              version: version + 1,
              updated_date: new Date().getTime(),
            }
          );
          if (id && status === "Sent") {
            this.logger.log(
              `updateMailInOutbox: SUCCESS: true, response: ${JSON.stringify({
                id,
                status,
              })}`
            );
          }
        }
      }
    };
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
  }

  async getNotSentMailInOutbox(
    database_name: string,
    schema_version: string,
    entity_name: string
  ): Promise<ISearchResults> {
    const search_params: ISearchParams = {
      type: "entity",
      entities: [
        {
          name: entity_name,
          schema_version,
        },
      ],
      database: database_name,
      metadata: {
        [entity_name]: [],
      },
      advance_filter: [
        {
          column: "status",
          values: ["Sent"],
          operator: "not_equal",
        },
        {
          column: "email_to",
          values: [""],
          operator: "is_not_empty",
        },
      ],
      enable_list: true,
      enable_return_all_fields: true,
      size: 1,
    };
    return await this.searchService
      .search(search_params)
      .then((res) => res)
      .catch((err: any) => {
        this.logger.error(`Search error: ${err}`);
      });
  }

  async updateMailInOutbox(
    database_name: string,
    schema_version: string,
    entity_name: string,
    params: any
  ): Promise<any> {
    return await this.store
      .update(`${database_name}_core_db_${schema_version}`, entity_name, params)
      .then((res) => res)
      .catch((err) => {
        this.logger.error(`updateMailInOutbox error: ${err}`);
      });
  }
}
