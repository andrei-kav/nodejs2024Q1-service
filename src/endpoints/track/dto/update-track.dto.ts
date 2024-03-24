import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsNumber()
  duration?: number | null;

  @IsOptional()
  @IsString()
  artistId?: string | null;

  @IsOptional()
  @IsString()
  albumId?: string | null;
}
