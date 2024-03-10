import {IAlbum} from "../../../database/types/Album";
import {v4 as uuidv4} from "uuid";
import {CreateAlbumDto} from "../dto/create-album.dto";
import {UpdateAlbumDto} from "../dto/update-album.dto";

export class Album {
    private readonly id: string
    private name: string
    private year: number
    private artistId: string | null

    constructor(album: IAlbum) {
        this.id = album.id
        this.name = album.name
        this.year = album.year
        this.artistId = album.artistId
    }

    static create(createAlbumDto: CreateAlbumDto): Album {
        const id = uuidv4()
        const name = createAlbumDto.name
        const year = createAlbumDto.year
        const artistId = createAlbumDto.artistId || null
        return new Album({id, name, year, artistId})
    }

    toObj(): IAlbum {
        return {
            id: this.id,
            name: this.name,
            year: this.year,
            artistId: this.artistId
        }
    }

    update(updateAlbumDto: UpdateAlbumDto) {
        const {name, year, artistId} = updateAlbumDto
        if (name) { this.name = name }
        if (typeof year === "number") { this.year = year }
        if (typeof artistId === "string" || artistId === null) {
            this.artistId = artistId
        }
    }
}
