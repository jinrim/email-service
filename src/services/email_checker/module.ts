import { Module } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CheckerService } from "./service";
import { SearchServiceModule } from "../search_service/module";
import { MainService } from "src/main.service";
import { DefaultStoreService } from "@dnamicro/service-common/build/stores/default_store/service";

@Module({
  imports: [SearchServiceModule, SchedulerRegistry, MainService],
  providers: [CheckerService, DefaultStoreService],
  exports: [CheckerService],
})
export class CheckerModule {}
