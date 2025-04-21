export interface TRating {
  likes: number;
  dislikes: number;
}

export interface AddNewRatingDto {
  postId: string;
  userId: string;
  ratingType: "like" | "dislike";
}
