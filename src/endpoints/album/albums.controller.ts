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
  ValidationPipe,
  Put,
  HttpCode,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { IAlbum } from '../../database/types/Album';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @Header('Content-Type', 'application/json')
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<IAlbum> {
    return await this.albumsService.create(createAlbumDto);
  }

  @Get()
  @Header('Content-Type', 'application/json')
  async findAll(): Promise<Array<IAlbum>> {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<IAlbum> {
    return await this.albumsService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Header('Content-Type', 'application/json')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<IAlbum> {
    return await this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.albumsService.remove(id);
  }
}
