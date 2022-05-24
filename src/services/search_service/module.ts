import { Module } from "@nestjs/common";
import { SearchService } from "./service";

@Module({
  imports: [],
  providers: [SearchServiceModule, SearchService],
  exports: [SearchService],
})
export class SearchServiceModule {}
