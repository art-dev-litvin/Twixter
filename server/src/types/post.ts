import { UserRecord } from 'firebase-admin/auth';
import { Timestamp } from 'firebase-admin/firestore';

export interface PostType {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  comments: Comment[];
  rating: Rating;

  commentsCount: number;
  likesCount: number;
}

type Comment = { user: UserRecord; text: string };
type Rating = {
  likes: number;
  dislikes: number;
};
