import { MeiliSearch } from "meilisearch";

const searchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST!,
  apiKey: process.env.REACT_APP_MEILISEARCH_KEY!,
});

const searchIndex = searchClient.index("posts");

searchIndex.updateSettings({
  filterableAttributes: ["properties.user", "properties.type", "_geo"],
});

const search = async (query: string, filter: string) => {
  return searchIndex.search(query, {
    filter: filter,
    limit: (await searchIndex.getStats()).numberOfDocuments,
  });
};

export { search };
