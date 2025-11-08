import { IsInt, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  pictureUrl?: string;

  @IsInt()
  @IsOptional()
  authorId?: number;
}
