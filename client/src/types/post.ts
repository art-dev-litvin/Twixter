export interface TPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  userId: string;
  userDisplayName: string;
  userPhotoUrl?: string;

  commentsCount: number;
  likesCount: number;
}

export interface CreatePostDto {
  title: string;
  content: string;
  imageUrl?: string;
  imageId?: string;
  userDisplayName: string;
  userId: string;
  userPhotoUrl?: string;
}

export type PostsSortByType = "likesCount" | "commentsCount";
