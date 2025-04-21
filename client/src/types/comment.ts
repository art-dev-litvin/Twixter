import { User } from "firebase/auth";

export interface TComment {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoUrl?: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateCommentDto {
  text: string;
  type: "comment" | "reply";
  parentCommentId?: string;
  postId: string;
  user: User;
}
