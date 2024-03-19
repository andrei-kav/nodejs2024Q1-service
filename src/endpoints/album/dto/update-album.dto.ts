import {IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateAlbumDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsNumber()
    year?: number

    @IsOptional()
    @IsString()
    artistId?: string | null
}
