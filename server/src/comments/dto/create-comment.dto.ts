import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  parentCommentId?: string;

  @IsNotEmpty()
  @IsString()
  type: 'comment' | 'reply';

  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userDisplayName: string;

  @IsOptional()
  @IsString()
  userPhotoUrl?: string;
}
