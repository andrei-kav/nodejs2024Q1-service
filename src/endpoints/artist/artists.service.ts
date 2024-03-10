import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import {DatabaseService} from "../../database/database.service";
import {IArtist} from "../../database/types/Artist";
import {Artist} from "./entities/artist.entity";
import {Track} from "../track/entities/track.entity";

@Injectable()
export class ArtistsService {

  constructor(private db: DatabaseService) {
  }

  create(createArtistDto: CreateArtistDto): IArtist {
    const artis = Artist.create(createArtistDto)
    this.db.addArtist(artis.toObj())
    return artis.toObj()
  }

  findAll(): Array<IArtist> {
    return this.db.getArtists()
  }

  findOne(id: string): IArtist {
    return this.getArtistInfo(id)
  }

  update(id: string, updateArtistDto: UpdateArtistDto): IArtist {
    const artist = new Artist(this.getArtistInfo(id))
    artist.update(updateArtistDto)
    this.db.updateArtist(artist.toObj())
    return artist.toObj()
  }

  remove(id: string) {
    // get the artist to be sure that it exists
    this.getArtistInfo(id)
    this.db.deleteArtist(id)
    this.db.getTracksOfArtist(id).forEach(track => {
      const instance = new Track(track)
      instance.update({artistId: null})
      this.db.updateTrack(instance.toObj())
    })
  }

  private getArtistInfo(id: string): IArtist {
    const artist = this.db.getArtist(id)
    if (!artist) {
      throw new NotFoundException(`artist with id ${id} does not seem to exist`)
    }
    return artist
  }
}
