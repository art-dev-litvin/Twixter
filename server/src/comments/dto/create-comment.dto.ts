import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRecord } from 'firebase-admin/auth';

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
  user: UserRecord;
}
