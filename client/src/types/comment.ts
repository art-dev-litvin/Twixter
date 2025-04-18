export interface TComment {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoUrl?: string;
  text: string;
  createdAt: Date;
}
