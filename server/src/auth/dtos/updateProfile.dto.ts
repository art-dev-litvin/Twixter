import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  uid: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  newPassword?: string;

  @IsString()
  @IsOptional()
  profileImageBase64?: string;
}
