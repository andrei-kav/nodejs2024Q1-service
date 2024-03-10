import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import {DatabaseModule} from "../../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [TracksController],
  providers: [TracksService]
})
export class TracksModule {}
