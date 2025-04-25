import React from "react";
import Input from "../Input";
import { useSearchParams } from "react-router-dom";

function SearchPosts() {
  const [query, setQuery] = React.useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const newQuery = searchParams.get("query") || "";
    setQuery(newQuery);
  }, [searchParams]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        query,
      });
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <Input
        placeholder="Search posts..."
        value={query}
        onChange={handleSearchChange}
      />
    </div>
  );
}

export default SearchPosts;
