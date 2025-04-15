import { User } from "firebase/auth";

export interface PostType {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  comments: Comment[];
  rating: Rating;
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
  userPhotoURL?: string;
}
