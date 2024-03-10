import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import {IAlbum} from "../../database/types/Album";
import {DatabaseService} from "../../database/database.service";
import {Album} from "./entities/album.entity";
import {Track} from "../track/entities/track.entity";

@Injectable()
export class AlbumsService {

  constructor(private db: DatabaseService) {
  }

  create(createAlbumDto: CreateAlbumDto): IAlbum {
    const album = Album.create(createAlbumDto)
    this.db.addAlbum(album.toObj())
    return album.toObj()
  }

  findAll(): Array<IAlbum> {
    return this.db.getAlbums()
  }

  findOne(id: string): IAlbum {
    return this.getAlbumInfo(id)
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = new Album(this.getAlbumInfo(id))
    album.update(updateAlbumDto)
    this.db.updateAlbum(album.toObj())
    return album.toObj()
  }

  remove(id: string) {
    // get the album to be sure that it exists
    this.getAlbumInfo(id)
    this.db.deleteAlbum(id)
    this.db.getTracksOfAlbum(id).forEach(track => {
      const instance = new Track(track)
      instance.update({albumId: null})
      this.db.updateTrack(instance.toObj())
    })
    // update favorites
    const updated = this.db.getFavAlbums().filter(albumId => albumId !== id)
    this.db.updateFavAlbums(updated)
  }

  private getAlbumInfo(id: string): IAlbum {
    const album = this.db.getAlbum(id)
    if (!album) {
      throw new NotFoundException(`album with id ${id} does not seem to exist`)
    }
    return album
  }
}
