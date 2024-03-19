import {Injectable, NotFoundException, UnprocessableEntityException} from '@nestjs/common';
import {DatabaseService} from "../../database/database.service";
import {IArtist} from "../../database/types/Artist";
import {IAlbum} from "../../database/types/Album";
import {ITrack} from "../../database/types/Track";

export enum EntityType {
  TRACKS = 'track',
  ALBUMS = 'album',
  ARTISTS = 'artist'
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

  findAll(): IFavoritesResponse {
    const response = {artists: [], albums: [], tracks: []}
    Object.entries(this.db.getFavorites())
        .forEach(([key, value]: ['artists' | 'albums' | 'tracks', Array<string>]) => {
          switch (key) {
            case 'artists':
              response[key] = value.map(id => this.db.getArtist(id))
              break;
            case 'albums':
              response[key] = value.map(id => this.db.getAlbum(id))
              break;
            case 'tracks':
              response[key] = value.map(id => this.db.getTrack(id))
              break;
          }
        })
    return response
  }

  add(entity: EntityType, id: string) {
    switch (entity) {
      case EntityType.TRACKS:
        return this.addTrackToFav(id)
      case EntityType.ALBUMS:
        return this.addAlbumToFav(id)
      case EntityType.ARTISTS:
        return this.addArtistToFav(id)
    }
  }

  remove(entity: EntityType, id: string) {
    switch (entity) {
      case EntityType.TRACKS:
        return this.removeTrackFromFav(id)
      case EntityType.ALBUMS:
        return this.removeAlbumFromFav(id)
      case EntityType.ARTISTS:
        return this.removeArtistFromFav(id)
    }
  }

  /**
   * TRACKS
   */
  private addTrackToFav(id: string) {
    const track = this.db.getTrack(id)
    if (!track) {
      throw new UnprocessableEntityException(`track with id ${id} does not seem to exist`)
    }
    // avoid multiple adding
    const updated = [...this.db.getFavTracks().filter(trackId => trackId !== id), id]
    this.db.updateFavTracks(updated)
  }

  private removeTrackFromFav(id: string) {
    const track = this.db.getFavTracks().find(trackId => trackId === id)
    if (!track) {
      throw new NotFoundException(`track with id ${id} is not in favorites`)
    }
    const updated = this.db.getFavTracks().filter(trackId => trackId !== id)
    this.db.updateFavTracks(updated)
  }

  /**
   * ALBUMS
   */
  private addAlbumToFav(id: string) {
    const album = this.db.getAlbum(id)
    if (!album) {
      throw new UnprocessableEntityException(`album with id ${id} does not seem to exist`)
    }
    // avoid multiple adding
    const updated = [...this.db.getFavAlbums().filter(albumId => albumId !== id), id]
    this.db.updateFavAlbums(updated)
  }

  private removeAlbumFromFav(id: string) {
    const album = this.db.getFavAlbums().find(albumId => albumId === id)
    if (!album) {
      throw new NotFoundException(`album with id ${id} is not in favorites`)
    }
    const updated = this.db.getFavAlbums().filter(albumId => albumId !== id)
    this.db.updateFavAlbums(updated)
  }

  /**
   * ARTISTS
   */
  private addArtistToFav(id: string) {
    const artist = this.db.getArtist(id)
    if (!artist) {
      throw new UnprocessableEntityException(`artist with id ${id} does not seem to exist`)
    }
    // avoid multiple adding
    const updated = [...this.db.getFavArtists().filter(artistId => artistId !== id), id]
    this.db.updateFavArtists(updated)
  }

  private removeArtistFromFav(id: string) {
    const artist = this.db.getFavArtists().find(artistId => artistId === id)
    if (!artist) {
      throw new NotFoundException(`artist with id ${id} is not in favorites`)
    }
    const updated = this.db.getFavArtists().filter(artistId => artistId !== id)
    this.db.updateFavArtists(updated)
  }
}
