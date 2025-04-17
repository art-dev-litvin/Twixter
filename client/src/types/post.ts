import { User } from "firebase/auth";

export interface PostType {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  userId: string;
  userDisplayName: string;
  userPhotoUrl?: string;
  comments: Comment[];
  rating: Rating;

  commentsCount: number;
  likesCount: number;
}

type Comment = { user: User; text: string };
type Rating = {
  likes: number;
  dislikes: number;
};

export interface CreatePostDto {
  title: string;
  content: string;
  imageBase64?: string;
  userDisplayName: string;
  userId: string;
  userPhotoUrl?: string;
}

export type PostsSortByType = "likesCount" | "commentsCount";
