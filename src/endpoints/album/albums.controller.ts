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
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import {IAlbum} from "../../database/types/Album";

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @Header('Content-Type', 'application/json')
  create(@Body() createAlbumDto: CreateAlbumDto): IAlbum {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  @Header('Content-Type', 'application/json')
  findAll(): Array<IAlbum> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  findOne(@Param('id', ParseUUIDPipe) id: string): IAlbum {
    return this.albumsService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Header('Content-Type', 'application/json')
  update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateAlbumDto: UpdateAlbumDto
  ): IAlbum {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumsService.remove(id);
  }
}
