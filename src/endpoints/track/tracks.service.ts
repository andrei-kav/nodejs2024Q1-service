import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import {DatabaseService} from "../../database/database.service";
import {ITrack} from "../../database/types/Track";
import {Track} from "./entities/track.entity";

@Injectable()
export class TracksService {

  constructor(private db: DatabaseService) {
  }

  create(createTrackDto: CreateTrackDto): ITrack {
    const newTrack = Track.create(createTrackDto)
    this.db.addTrack(newTrack.toObj())
    return newTrack.toObj()
  }

  findAll(): Array<ITrack> {
    return this.db.getTracks()
  }

  findOne(id: string): ITrack {
    return this.getTrackInfo(id)
  }

  update(id: string, updateTrackDto: UpdateTrackDto): ITrack {
    const track = new Track(this.getTrackInfo(id))
    track.update(updateTrackDto)
    this.db.updateTrack(track.toObj())
    return track.toObj()
  }

  remove(id: string) {
    // get the track to be sure that it exists
    this.getTrackInfo(id)
    this.db.deleteTrack(id)
  }

  private getTrackInfo(id: string): ITrack {
    const track = this.db.getTrack(id)
    if (!track) {
      throw new NotFoundException(`track with id ${id} does not seem to exist`)
    }
    return track
  }
}
