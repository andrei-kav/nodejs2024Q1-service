import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import {DatabaseService} from "../../database/database.service";
import {IArtist} from "../../database/types/Artist";

@Injectable()
export class ArtistsService {

  constructor(private db: DatabaseService) {
  }

  async create(createArtistDto: CreateArtistDto): Promise<IArtist> {
    return await this.db.artist.create({ data: createArtistDto });
  }

  async findAll(): Promise<Array<IArtist>> {
    return await this.db.artist.findMany()
  }

  async findOne(id: string): Promise<IArtist> {
    return await this.getArtistInfo(id)
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<IArtist> {
    await this.getArtistInfo(id)
    return await this.db.artist.update({
      where: { id },
      data: updateArtistDto
    })
  }

  async remove(id: string) {
    await this.getArtistInfo(id)
    await this.db.artist.delete({ where: { id } })
  }

  private async getArtistInfo(id: string): Promise<IArtist> {
    const artist = await this.db.artist.findUnique({ where: { id } })
    if (!artist) {
      throw new NotFoundException(`artist with id ${id} does not seem to exist`)
    }
    return artist
  }
}
