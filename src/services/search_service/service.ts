import { HttpService, Injectable, Logger } from "@nestjs/common";
import { ISearchParams } from "./types";
const {
  ELASTIC_USERNAME = "admin",
  ELASTIC_PASSWORD = "admin",
  SEARCH_ENDPOINT = "http://localhost:5300/search",
} = process.env;

@Injectable()
class SearchService {
  private httpService: HttpService;
  private searchEndPoint: string;
  private elasticUsername: string;
  private elasticPassword: string;
  private logger: Logger;
  constructor() {
    this.searchEndPoint = SEARCH_ENDPOINT;
    this.elasticUsername = ELASTIC_USERNAME;
    this.elasticPassword = ELASTIC_PASSWORD;
    this.httpService = new HttpService();
    this.logger = new Logger("SEARCH:SERVICE");
  }

  search = async (params: ISearchParams): Promise<any> => {
    const search = ((await this.httpService
      .post(this.searchEndPoint, params, {
        auth: {
          username: this.elasticUsername,
          password: this.elasticPassword,
        },
      })
      .toPromise()
      .then((response: any) => response.data)
      .catch((err: any) => {
        if (!err.response) {
          this.logger.error(`Search Error: ${err}`);
          return "";
        }
        this.logger.error(
          `[STATUS]: ${err.response.status} | [RESPONSE]: ${JSON.stringify(
            err.response.data
          )}`
        );
        return {};
      })) as unknown) as {};
    return search;
  };
}

export { SearchService };
