import React from "react";
import Button from "../Button";

type PaginationProps = {
  currentPageIndex: number;
  onPrev: () => void;
  onNext: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPageIndex,
  onPrev,
  onNext,
  isPrevDisabled,
  isNextDisabled,
}) => {
  return (
    <div>
      <span className="font-bold inline-block mb-2">
        Page {currentPageIndex + 1}
      </span>
      <div className="flex items-center gap-2">
        <Button onClick={onPrev} disabled={isPrevDisabled}>
          Prev
        </Button>

        <Button onClick={onNext} disabled={isNextDisabled}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
