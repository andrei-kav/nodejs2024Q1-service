import { Module } from '@nestjs/common';
import {UsersModule} from "./user/users.module";
import {ArtistsModule} from "./artist/artists.module";
import {AlbumsModule} from "./album/albums.module";
import {TracksModule} from "./track/tracks.module";
import {FavoritesModule} from "./favs/favorites.module";

@Module({
    imports: [
        UsersModule,
        ArtistsModule,
        AlbumsModule,
        TracksModule,
        FavoritesModule
    ]
})
export class EndpointsModule {}
