import { UserRecord } from 'firebase-admin/auth';

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
}

type Comment = { user: UserRecord; text: string };
type Rating = {
  likes: number;
  dislikes: number;
};
