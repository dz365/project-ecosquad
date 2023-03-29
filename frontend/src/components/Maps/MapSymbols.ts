import Biosphere from "../../assets/map-symbols/biosphere.png";
import Lithosphere from "../../assets/map-symbols/lithosphere.png";
import Atmosphere from "../../assets/map-symbols/atmosphere.png";
import Hydrosphere from "../../assets/map-symbols/hydrosphere.png";
import Weather from "../../assets/map-symbols/weather.png";
import Space from "../../assets/map-symbols/space.png";
import Other from "../../assets/map-symbols/other.png";

export const IconSymbols = [
  {
    icon: Lithosphere,
    id: "lithosphere",
  },
  {
    icon: Atmosphere,
    id: "atmosphere",
  },
  {
    icon: Hydrosphere,
    id: "hydrosphere",
  },
  {
    icon: Biosphere,
    id: "biosphere",
  },
  {
    icon: Weather,
    id: "weather",
  },
  {
    icon: Space,
    id: "space",
  },
  {
    icon: Other,
    id: "other",
  },
];

interface IconImages {
  [key: string]: string;
}

export const ICON_IMAGES: IconImages = {
  lithosphere: Lithosphere,
  atmosphere: Atmosphere,
  hydrosphere: Hydrosphere,
  biosphere: Biosphere,
  weather: Weather,
  space: Space,
  other: Other,
};
