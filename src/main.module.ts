import { Module } from "@nestjs/common";
import { MainController } from "./main.controller";
import { MainService } from "./main.service";
import { CheckerModule } from "./services/email_checker/module";
@Module({
  imports: [CheckerModule],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
