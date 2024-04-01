import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { join } from 'path';
import * as dotenv from 'dotenv';
import {CustomExceptionFilter} from "./services/exception-filter/exception.filter";
import {ConfigService} from "@nestjs/config";
import {LoggingService} from "./services/logging/logging.service";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // bind logging service
  const loggingService = await app.resolve(LoggingService)
  app.useLogger(loggingService)

  // apply custom exception filter globally
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CustomExceptionFilter(httpAdapterHost, loggingService));

  try {
    const filePath = join(__dirname, '..', 'doc', 'api.yaml');
    const file = await readFile(filePath, 'utf-8');
    const swaggerDocument = parse(file);
    SwaggerModule.setup('doc', app, swaggerDocument);
  } catch (error) {
    await loggingService.log(`swagger api documentation is not configured, ${error}`)
  }

  const configService = app.get(ConfigService);

  const PORT = Number(configService.get('PORT') || 4000);
  await app.listen(PORT);

  process.on('uncaughtException', (error) => {
    loggingService.log('uncaughtException')
    loggingService.error(error)
  })

  process.on('unhandledRejection', (error) => {
    loggingService.log('unhandledRejection')
    loggingService.error(error)
  })
}
bootstrap();
