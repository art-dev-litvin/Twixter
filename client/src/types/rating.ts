export interface TRating {
  likes: number;
  dislikes: number;
}

export interface UpdateRatingDto {
  postId: string;
  userId: string;
  ratingType: "like" | "dislike";
}
