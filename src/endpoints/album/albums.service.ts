import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import {IAlbum} from "../../database/types/Album";
import {DatabaseService} from "../../database/database.service";

@Injectable()
export class AlbumsService {

  constructor(private db: DatabaseService) {
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<IAlbum> {
    return await this.db.album.create({ data: createAlbumDto })
  }

  async findAll(): Promise<Array<IAlbum>> {
    return this.db.album.findMany()
  }

  async findOne(id: string): Promise<IAlbum> {
    return await this.getAlbumInfo(id)
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<IAlbum> {
    await this.getAlbumInfo(id)
    return this.db.album.update({
      where: { id },
      data: updateAlbumDto
    })
  }

  async remove(id: string) {
    await this.getAlbumInfo(id)
    await this.db.album.delete({ where: { id } })
  }

  private async getAlbumInfo(id: string): Promise<IAlbum> {
    const album = await this.db.album.findUnique({ where: { id } })
    if (!album) {
      throw new NotFoundException(`album with id ${id} does not seem to exist`)
    }
    return album
  }
}
