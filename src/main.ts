import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule} from "@nestjs/swagger";
import {parse} from 'yaml'
import {readFile} from 'fs/promises'
import {join} from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const filePath = join(__dirname, '..', 'doc', 'api.yaml')
  const file = await readFile(filePath, 'utf-8')
  const swaggerDocument = parse(file)
  SwaggerModule.setup('doc', app, swaggerDocument)

  const PORT = Number(process.env.PORT || 4000)
  await app.listen(PORT)
}
bootstrap();
