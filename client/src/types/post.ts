export interface PostType {
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
  imageBase64?: string;
  userDisplayName: string;
  userId: string;
  userPhotoUrl?: string;
}

export interface UpdatePostDto {
  title: string;
  content: string;
  imageBase64?: string;
  oldImageUrl?: string;
}

export type PostsSortByType = "likesCount" | "commentsCount";
