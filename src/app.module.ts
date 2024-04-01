import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EndpointsModule } from './endpoints/endpoints.module';
import { AuthModule } from './endpoints/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './services/middlewares/logging.middleware';
import { LoggingModule } from './services/logging/logging.module';

@Module({
  imports: [
    EndpointsModule,
    AuthModule,
    LoggingModule,
    // to have access to .env file through ConfigService
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
