import { useAuth0 } from "@auth0/auth0-react";
import { LngLat } from "maplibre-gl";
import { useEffect, useState } from "react";
import { getUser } from "../../service/test.service";

interface LocationSearch {
  setLocation: (location: LngLat) => void;
}
const LocationSearch: React.FC<LocationSearch> = ({ setLocation }) => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userLocation, setUserLocation] = useState<LngLat>();

  const [searchUsingCurrentLocation, setSearchUsingCurrentLocation] =
    useState(true);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      getUser(token, user!.sub!)
        .then((res) => {
          const coordinates = res.geometry.coordinates;
          setUserLocation(new LngLat(coordinates[0], coordinates[1]));
          setLng(coordinates[0]);
          setLat(coordinates[1]);
        })
        .catch(() => {});
    });
  }, []);

  useEffect(() => {
    if (searchUsingCurrentLocation && userLocation) {
      setLocation(userLocation);
    } else {
      setLocation(new LngLat(+lng, +lat));
    }
  }, [searchUsingCurrentLocation, userLocation, lat, lng]);

  const handleLatChange = (lat: number) => {
    if (lat < -90) return setLat(-90);
    if (lat > 90) return setLat(90);
    return setLat(lat);
  };

  const handleLngChange = (lng: number) => {
    if (lng < -180) return setLng(-180);
    if (lng > 180) return setLng(180);
    return setLng(lng);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-green-600">Location</span>
      <label className="flex gap-2">
        <input
          type="radio"
          value="currentlocation"
          checked={searchUsingCurrentLocation}
          onChange={() => setSearchUsingCurrentLocation(true)}
        />
        <span>Use current location</span>
      </label>
      <label className="flex gap-2">
        <input
          type="radio"
          value="newlocation"
          checked={!searchUsingCurrentLocation}
          onChange={() => setSearchUsingCurrentLocation(false)}
        />
        <div className="flex flex-col gap-1">
          <label className="flex justify-between gap-2">
            Latitude
            <input
              type="number"
              min={-90}
              max={90}
              step={0.1}
              value={lat}
              onChange={(e) => handleLatChange(+e.target.value)}
              onClick={() => setSearchUsingCurrentLocation(false)}
              className="w-20 text-sm border px-1 py-px rounded-lg"
            />
          </label>
          <label className="flex justify-between gap-2">
            Longitude
            <input
              type="number"
              value={lng}
              onChange={(e) => handleLngChange(+e.target.value)}
              onClick={() => setSearchUsingCurrentLocation(false)}
              className="w-20 text-sm border px-1 py-px rounded-lg"
            />
          </label>
        </div>
      </label>
    </div>
  );
};

export default LocationSearch;
