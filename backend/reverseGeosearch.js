import { MAP_TILER_KEY } from "./api_keys.js";

export const reverseGeoSearch = async (longitude, latitude) => {
  const geosearch = await fetch(
    `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${MAP_TILER_KEY}&language=en`
  ).then((res) => res.json());

  const location = geosearch.features.find(
    (feature) =>
      feature.place_type[0] !== "address" &&
      feature.place_type[0] !== "postal_code"
  );
  return location?.place_name ?? "";
};
