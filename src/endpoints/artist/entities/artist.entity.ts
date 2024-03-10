import {IArtist} from "../../../database/types/Artist";
import {CreateArtistDto} from "../dto/create-artist.dto";
import {v4 as uuidv4} from "uuid";
import {UpdateArtistDto} from "../dto/update-artist.dto";

export class Artist {

    private readonly id: string
    private name: string
    private grammy: boolean

    constructor(artist: IArtist) {
        this.id = artist.id
        this.name = artist.name
        this.grammy = artist.grammy
    }

    static create(createArtistDto: CreateArtistDto): Artist {
        const id = uuidv4()
        return new Artist({id, ...createArtistDto})
    }

    toObj(): IArtist {
        return {
            id: this.id,
            name: this.name,
            grammy: this.grammy
        }
    }

    update(updateArtistDto: UpdateArtistDto) {
        const {name, grammy} = updateArtistDto
        if (name) { this.name = name }
        if (typeof grammy === "boolean") { this.grammy = grammy }
    }

}
