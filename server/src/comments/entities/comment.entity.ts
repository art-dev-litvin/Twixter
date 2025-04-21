export class Comment {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoUrl?: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
