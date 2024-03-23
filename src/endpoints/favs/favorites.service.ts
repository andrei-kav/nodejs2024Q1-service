import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import {DatabaseService} from "../../database/database.service";
import {IArtist} from "../../database/types/Artist";
import {IAlbum} from "../../database/types/Album";
import {ITrack} from "../../database/types/Track";

export enum EntityType {
  TRACK = 'track',
  ALBUM = 'album',
  ARTIST = 'artist'
}

export interface IFavoritesResponse {
  artists: IArtist[];
  albums: IAlbum[];
  tracks: ITrack[];
}

@Injectable()
export class FavoritesService {

  constructor(private db: DatabaseService) {
  }

  async findAll(): Promise<IFavoritesResponse> {
    const fav = await this.db.favorites.findFirst({
      select: { artists: true, albums: true, tracks: true }
    })
    if (!fav) {
      return { artists: [], albums: [], tracks: [] }
    }
    return fav
  }

  async add(entity: EntityType, id: string) {
    switch (entity) {
      case EntityType.TRACK:
        return await this.addTrackToFav(id)
      case EntityType.ALBUM:
        return await this.addAlbumToFav(id)
      case EntityType.ARTIST:
        return await this.addArtistToFav(id)
    }
  }

  async remove(entity: EntityType, id: string) {
    switch (entity) {
      case EntityType.TRACK:
        return await this.removeTrackFromFav(id)
      case EntityType.ALBUM:
        return await this.removeAlbumFromFav(id)
      case EntityType.ARTIST:
        return await this.removeArtistFromFav(id)
    }
  }

  /**
   * TRACKS
   */
  private async addTrackToFav(id: string) {
    const track = await this.db.track.findUnique({ where: { id }})
    if (!track) {
      throw new UnprocessableEntityException(`track with id ${id} does not seem to exist`)
    }
    const favId = await this.getFavID()
    await this.db.favorites.update({
      where: { id: favId },
      data: { tracks: { connect: { id } } }
    });
  }

  private async removeTrackFromFav(id: string) {
    const favId = await this.getFavID()
    await this.db.favorites.update({
      where: { id: favId },
      data: { tracks: { disconnect: { id } } }
    });
  }

  /**
   * ALBUMS
   */
  private async addAlbumToFav(id: string) {
    const album = await this.db.album.findUnique({ where: { id }})
    if (!album) {
      throw new UnprocessableEntityException(`album with id ${id} does not seem to exist`)
    }
    const favId = await this.getFavID()
    await this.db.favorites.update({
      where: { id: favId },
      data: { albums: { connect: { id } } }
    });
  }

  private async removeAlbumFromFav(id: string) {
    const favId = await this.getFavID()
    await this.db.favorites.update({
      where: { id: favId },
      data: { albums: { disconnect: { id } } }
    });
  }

  /**
   * ARTISTS
   */
  private async addArtistToFav(id: string) {
    const artist = await this.db.artist.findUnique({ where: { id }})
    if (!artist) {
      throw new UnprocessableEntityException(`artist with id ${id} does not seem to exist`)
    }
    const favId = await this.getFavID()
    await this.db.favorites.update({
      where: { id: favId },
      data: { artists: { connect: { id } } }
    });
  }

  private async removeArtistFromFav(id: string) {
    const favId = await this.getFavID()
    await this.db.favorites.update({
      where: { id: favId },
      data: { artists: { disconnect: { id } } }
    });
  }

  private async getFavID(): Promise<string> {
    const fav = await this.db.favorites.findFirst();
    if (!fav) {
      const created = await this.db.favorites.create({ data: {} });
      return created.id
    }
    return fav.id
  }
}
