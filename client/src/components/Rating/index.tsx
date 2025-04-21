import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import Button from "../Button";
import React from "react";
import { TRating } from "../../types/rating";
import { getRating } from "../../services/api-requests/rating/getRating";
import { handleResultWithToast } from "../../utils/handleResultWithToast";
import { updateRating } from "../../services/api-requests/rating/updateRating";
import { auth } from "../../services/firebase";
import { toast } from "react-toastify";

interface RatingProps {
  postId: string;
}

function Rating({ postId }: RatingProps) {
  const [rating, setRating] = React.useState<TRating>({
    likes: 0,
    dislikes: 0,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchRating = async () => {
      const res = await getRating(postId);

      const data = handleResultWithToast(res);

      if (data) {
        setRating(data);
      }
    };

    fetchRating();
  }, [postId]);

  const onUpdateRating = (ratingType: "like" | "dislike") => async () => {
    setIsLoading(true);
    const user = auth.currentUser;

    if (!user) return toast.error("You are not authenticated");

    const res = await updateRating({ postId, ratingType, userId: user.uid });

    setIsLoading(false);
    const data = handleResultWithToast(res);

    if (data) {
      setRating(data);
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        disabled={isLoading}
        onClick={onUpdateRating("like")}
        className="!size-11 gap-1"
        isIconOnly
        variant="transparent">
        <ThumbsUpIcon className="shrink-0 size-5" />
        {rating.likes}
      </Button>

      <Button
        disabled={isLoading}
        onClick={onUpdateRating("dislike")}
        className="!size-11 gap-1"
        isIconOnly
        variant="transparent">
        <ThumbsDownIcon className="shrink-0 size-5" />
        {rating.dislikes}
      </Button>
    </div>
  );
}

export default Rating;
