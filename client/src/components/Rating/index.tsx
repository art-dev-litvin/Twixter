import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import Button from "../Button";
import React from "react";
import { TRating } from "../../types/rating";
import { getRating } from "../../services/api-requests/rating/getRating";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

interface RatingProps {
  postId: string;
}

function Rating({ postId }: RatingProps) {
  const [rating, setRating] = React.useState<TRating>({
    likes: 0,
    dislikes: 0,
  });

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

  return (
    <div className="flex gap-4">
      <Button className="!size-11 gap-1" isIconOnly variant="transparent">
        <ThumbsUpIcon className="shrink-0 size-5" />
        {rating.likes}
      </Button>

      <Button className="!size-11 gap-1" isIconOnly variant="transparent">
        <ThumbsDownIcon className="shrink-0 size-5" />
        {rating.dislikes}
      </Button>
    </div>
  );
}

export default Rating;
