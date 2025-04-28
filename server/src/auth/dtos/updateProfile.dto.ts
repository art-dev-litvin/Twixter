import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  newPassword?: string;

  @IsString()
  @IsOptional()
  updatedImageUrl?: string;
}
