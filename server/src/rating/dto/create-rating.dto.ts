export class CreateRatingDto {
  postId: string;
  userId: string;
  ratingType: 'like' | 'dislike';
}
