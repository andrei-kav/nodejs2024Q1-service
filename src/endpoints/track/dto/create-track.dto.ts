import {IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateTrackDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsInt()
    duration: number

    @IsOptional()
    @IsString()
    artistId: string | null

    @IsOptional()
    @IsString()
    albumId: string | null
}
