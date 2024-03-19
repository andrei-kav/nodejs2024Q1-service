import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Header,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe, Put, HttpCode
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import {ITrack} from "../../database/types/Track";

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @Header('Content-Type', 'application/json')
  create(@Body() createTrackDto: CreateTrackDto): ITrack {
    return this.tracksService.create(createTrackDto)
  }

  @Get()
  @Header('Content-Type', 'application/json')
  findAll(): Array<ITrack> {
    return this.tracksService.findAll()
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  findOne(@Param('id', ParseUUIDPipe) id: string): ITrack {
    return this.tracksService.findOne(id)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Header('Content-Type', 'application/json')
  update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateTrackDto: UpdateTrackDto
  ) {
    return this.tracksService.update(id, updateTrackDto)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.tracksService.remove(id)
  }
}
