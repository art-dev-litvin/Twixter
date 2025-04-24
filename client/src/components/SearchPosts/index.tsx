import React from "react";
import Input from "../Input";

function SearchPosts() {
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (query && query.trim()) {
        console.log(query.trim());
        console.log("Debounced query:", query);
      }
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
