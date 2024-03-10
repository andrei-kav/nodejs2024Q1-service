import {ITrack} from "../../../database/types/Track";
import {v4 as uuidv4} from "uuid";
import {CreateTrackDto} from "../dto/create-track.dto";
import {UpdateTrackDto} from "../dto/update-track.dto";

export class Track {
    private readonly id: string;
    private name: string;
    private artistId: string | null;
    private albumId: string | null;
    private duration: number;

    constructor(track: ITrack) {
        this.id = track.id
        this.name = track.name
        this.artistId = track.artistId
        this.albumId = track.albumId
        this.duration = track.duration
    }

    static create(createTrackDto: CreateTrackDto): Track {
        const id = uuidv4()
        const name = createTrackDto.name
        const duration = createTrackDto.duration
        const artistId = createTrackDto.artistId || null
        const albumId = createTrackDto.albumId || null
        return new Track({id, name, duration, albumId, artistId})
    }

    toObj(): ITrack {
        return {
            id: this.id,
            name: this.name,
            artistId: this.artistId,
            albumId: this.albumId,
            duration: this.duration
        }
    }

    update(updateTrackDto: UpdateTrackDto) {
        const {name, duration, albumId, artistId} = updateTrackDto
        if (name) { this.name = name }
        if (typeof duration === "number") { this.duration = duration }
        if (typeof albumId === "string" || albumId === null) {
            this.albumId = albumId
        }
        if (typeof artistId === "string" || artistId === null) {
            this.artistId = artistId
        }
    }
}
