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
  async create(@Body() createTrackDto: CreateTrackDto): Promise<ITrack> {
    return await this.tracksService.create(createTrackDto)
  }

  @Get()
  @Header('Content-Type', 'application/json')
  async findAll(): Promise<Array<ITrack>> {
    return await this.tracksService.findAll()
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ITrack> {
    return await this.tracksService.findOne(id)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Header('Content-Type', 'application/json')
  async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateTrackDto: UpdateTrackDto
  ): Promise<ITrack> {
    return await this.tracksService.update(id, updateTrackDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tracksService.remove(id)
  }
}
