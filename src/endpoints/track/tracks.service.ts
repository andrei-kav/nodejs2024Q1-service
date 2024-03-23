import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import {DatabaseService} from "../../database/database.service";
import {ITrack} from "../../database/types/Track";

@Injectable()
export class TracksService {

  constructor(private db: DatabaseService) {
  }

  async create(createTrackDto: CreateTrackDto): Promise<ITrack> {
    return await this.db.track.create({
      data: createTrackDto
    });
  }

  async findAll(): Promise<Array<ITrack>> {
    return await this.db.track.findMany()
  }

  async findOne(id: string): Promise<ITrack> {
    return await this.getTrackInfo(id)
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<ITrack> {
    await this.getTrackInfo(id)
    return await this.db.track.update({
      where: { id },
      data: updateTrackDto,
    })
  }

  async remove(id: string) {
    await this.getTrackInfo(id)
    await this.db.track.delete({ where: { id } })
  }

  private async getTrackInfo(id: string): Promise<ITrack> {
    const user = await this.db.track.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`track with id ${id} does not seem to exist`)
    }
    return user
  }
}
