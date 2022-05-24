import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { LoggingInterceptor } from "./main.interceptor";
import { MainModule } from "./main.module";

const logger = new Logger("API", true);
const { PORT = "5300" } = process.env;

async function bootstrap() {
  const main = await NestFactory.create(MainModule);
  main.useGlobalInterceptors(new LoggingInterceptor());
  main.useGlobalPipes(new ValidationPipe());
  await main.listen(PORT);

  logger.log(`Application is running on ${await main.getUrl()}`);
}

bootstrap();
