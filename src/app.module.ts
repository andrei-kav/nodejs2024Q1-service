import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EndpointsModule } from './endpoints/endpoints.module';
import { AuthModule } from './endpoints/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    EndpointsModule,
    AuthModule,
    // to have access to .env file through ConfigService
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
