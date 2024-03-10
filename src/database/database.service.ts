import {Injectable} from '@nestjs/common';
import {IUser} from "./types/User";
import {ITrack} from "./types/Track";
import {IArtist} from "./types/Artist";
import {IAlbum} from "./types/Album";

@Injectable()
export class DatabaseService {
    private readonly users: Map<string, IUser>
    private readonly tracks: Map<string, ITrack>
    private readonly artists: Map<string, IArtist>
    private readonly albums: Map<string, IAlbum>

    private readonly favs: Map<'artists' | 'albums' | 'tracks', Array<string>>

    // onModuleInit() {
    //     console.log('init database')
    //     this.users = new Map<string, IUser>()
    // }

    constructor() {
        console.log('init database')
        this.users = new Map<string, IUser>()
        this.tracks = new Map<string, ITrack>()
        this.artists = new Map<string, IArtist>()
        this.albums = new Map<string, IAlbum>()
        this.favs = new Map<'artists' | 'albums' | 'tracks', Array<string>>([
            ['artists', []],
            ['albums', []],
            ['tracks', []]
        ])
    }

    /**
     * USERS block
     */
    getUser(id): IUser | undefined {
        return this.users.get(id)
    }

    getUsers(): Array<IUser> {
        return Array.from(this.users.values())
    }

    addUser(user: IUser): IUser {
        this.users.set(user.id, user)
        return user
    }

    updateUser(user: IUser): IUser {
        this.deleteUser(user.id)
        return this.addUser(user)
    }

    deleteUser(id: string) {
        this.users.delete(id)
    }

    // doesUserExist(login: string): boolean {
    //     return !!this.getUsers().find(user => user.login === login)
    // }

    /**
     * TRACKS block
     */
    getTrack(id): ITrack | undefined {
        return this.tracks.get(id)
    }

    getTracks(): Array<ITrack> {
        return Array.from(this.tracks.values())
    }

    addTrack(track: ITrack): ITrack {
        this.tracks.set(track.id, track)
        return track
    }

    updateTrack(track: ITrack): ITrack {
        this.deleteTrack(track.id)
        return this.addTrack(track)
    }

    deleteTrack(id: string) {
        this.tracks.delete(id)
    }

    getTracksOfArtist(artistId: string): Array<ITrack> {
        return this.getTracks().filter(track => track.artistId === artistId)
    }

    getTracksOfAlbum(albumId: string): Array<ITrack> {
        return this.getTracks().filter(track => track.albumId === albumId)
    }

    /**
     * ARTISTS block
     */
    getArtist(id): IArtist | undefined {
        return this.artists.get(id)
    }

    getArtists(): Array<IArtist> {
        return Array.from(this.artists.values())
    }

    addArtist(artist: IArtist): IArtist {
        this.artists.set(artist.id, artist)
        return artist
    }

    updateArtist(artist: IArtist): IArtist {
        this.deleteArtist(artist.id)
        return this.addArtist(artist)
    }

    deleteArtist(id: string) {
        this.artists.delete(id)
    }

    /**
     * ALBUMS block
     */
    getAlbum(id): IAlbum | undefined {
        return this.albums.get(id)
    }

    getAlbums(): Array<IAlbum> {
        return Array.from(this.albums.values())
    }

    addAlbum(artist: IAlbum): IAlbum {
        this.albums.set(artist.id, artist)
        return artist
    }

    updateAlbum(artist: IAlbum): IAlbum {
        this.deleteAlbum(artist.id)
        return this.addAlbum(artist)
    }

    deleteAlbum(id: string) {
        this.albums.delete(id)
    }

    getAlbumsOfArtist(artistId: string): Array<IAlbum> {
        return this.getAlbums().filter(album => album.artistId === artistId)
    }

    /**
     * FAVORITES block
     */
    getFavorites(): IFavorites {
        const favs: IFavorites = {} as IFavorites
        Array.from(this.favs.entries()).forEach(([key, value]) => {
            favs[key] = value
        })
        return favs
    }

    getFavTracks(): Array<string> {
        return this.favs.get('tracks')
    }

    updateFavTracks(tracks: Array<string>) {
        this.favs.set('tracks', tracks)
    }

    getFavAlbums(): Array<string> {
        return this.favs.get('albums')
    }

    updateFavAlbums(albums: Array<string>) {
        this.favs.set('albums', albums)
    }

    getFavArtists(): Array<string> {
        return this.favs.get('artists')
    }

    updateFavArtists(artists: Array<string>) {
        this.favs.set('artists', artists)
    }
}
