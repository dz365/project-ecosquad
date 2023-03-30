import { MAP_TILER_KEY } from "./api_keys.js";

export const reverseGeoSearch = async (longitude, latitude) => {
  const geosearch = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=15`
  ).then((res) => res.json());
  return geosearch.display_name ?? "";
};
