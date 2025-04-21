export interface TRating {
  postId: string;
  userId: string;
  type: 'like' | 'dislike';
}
