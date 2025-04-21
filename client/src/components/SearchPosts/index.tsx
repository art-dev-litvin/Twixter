import React from "react";
import { useAlgoliaSearch } from "../../hooks/useAlgoliaSearch";
import Input from "../Input";

interface SearchPostsProps {
  setAlgoliaFoundPostIds: React.Dispatch<React.SetStateAction<string[]>>;
  setWithAlgoliaSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

function SearchPosts({
  setAlgoliaFoundPostIds,
  setWithAlgoliaSearch,
}: SearchPostsProps) {
  const [query, setQuery] = React.useState("");
  const { results, loading } = useAlgoliaSearch(query);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  React.useEffect(() => {
    if (query) {
      setWithAlgoliaSearch(true);
    } else {
      setWithAlgoliaSearch(false);
    }
    setAlgoliaFoundPostIds(results);
  }, [results, setAlgoliaFoundPostIds]);

  return (
    <div>
      <Input
        placeholder="Search posts..."
        value={query}
        onChange={handleSearchChange}
      />

      {loading ? <p>Loading...</p> : null}
    </div>
  );
}

export default SearchPosts;
