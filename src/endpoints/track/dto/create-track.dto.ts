import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateTrackDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsNumber()
    duration: number

    @IsOptional()
    @IsString()
    artistId: string | null

    @IsOptional()
    @IsString()
    albumId: string | null
}
