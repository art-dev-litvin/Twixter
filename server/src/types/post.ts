export interface TPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;

  commentsCount: number;
  likesCount: number;
}
