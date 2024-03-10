import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Header,
  ParseUUIDPipe,
  HttpCode,
  ParseEnumPipe
} from '@nestjs/common';
import {EntityType, FavoritesService, IFavoritesResponse} from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  findAll(): IFavoritesResponse {
    return this.favoritesService.findAll();
  }

  @Post(':entity/:id')
  @Header('Content-Type', 'application/json')
  add(
      @Param('entity', new ParseEnumPipe(EntityType)) entity: EntityType,
      @Param('id', ParseUUIDPipe) id: string
  ) {
    this.favoritesService.add(entity, id)
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  remove(
      @Param('entity', new ParseEnumPipe(EntityType)) entity: EntityType,
      @Param('id', ParseUUIDPipe) id: string
  ) {
    this.favoritesService.remove(entity, id)
  }
}
