import { ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { PostsSortByType } from "../../types/post";

function PostsSortBy() {
  const [searchParams, setSearchParams] = useSearchParams();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", value);
    setSearchParams(newParams);
  };

  return (
    <div className="relative">
      <ChevronDown className="absolute top-1/2 -translate-y-1/2 right-3" />
      <select
        onChange={onChange}
        defaultValue={searchParams.get("sortBy") as PostsSortByType}
        className="border-2 rounded-md h-10 w-[200px] px-3 appearance-none ">
        <option value={"likesCount" as PostsSortByType}>Likes count</option>
        <option value={"commentsCount" as PostsSortByType}>
          Comments count
        </option>
      </select>
    </div>
  );
}

export default PostsSortBy;
