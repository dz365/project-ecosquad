import * as dotenv from "dotenv";
import { MeiliSearch } from "meilisearch";

dotenv.config();

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST,
  apiKey: process.env.MEILISEARCH_KEY,
});

export const searchIndex = client.index("posts");
