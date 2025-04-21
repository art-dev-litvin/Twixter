import { useEffect, useState } from "react";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);

export const useAlgoliaSearch = (query: string, debounceMs = 400) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      client
        .searchSingleIndex({
          indexName: "algolia_posts_index",
          searchParams: { query },
        })
        .then(({ hits }) => setResults(hits.map((hit) => hit.objectID)))
        .finally(() => setLoading(false));
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  return { results, loading };
};
