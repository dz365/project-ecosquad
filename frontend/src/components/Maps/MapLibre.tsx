import { GeoJSONSource } from "maplibre-gl";
import maplibreGl, { Map } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { getPost, getPosts } from "../../service/test.service";
import Biosphere from "./biosphere.png";
import Lithosphere from "./lithosphere.png";
import Atmosphere from "./atmosphere.png";
import Hydrosphere from "./hydrosphere.png";
import Weather from "./weather.png";
import Space from "./space.png";
import Other from "./other.png";
import { useAuth0 } from "@auth0/auth0-react";

const MapLibre = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef<Map>();
  const [infoBarState, setInfoBarState] = useState<"" | "show" | "hide">("");
  const { getAccessTokenSilently } = useAuth0();

  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState([]);
  const [fileIds, setFileIds] = useState([]);
  useEffect(() => {
    getPosts().then((posts) => {
      if (mapRef.current) {
        return;
      }

      const map = new maplibreGl.Map({
        container: mapContainer.current!,
        style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${process.env.REACT_APP_MAP_TILER_KEY}`,
        center: [-79.3832, 43.6532],
        zoom: 0,
      });

      map.on("load", () => {
        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();
        map.addControl(new maplibreGl.NavigationControl({}));

        // Add a new source from our GeoJSON data and
        // set the 'cluster' option to true. GL-JS will
        // add the point_count property to your source data.
        map.addSource("earthquakes", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: posts.results as GeoJSON.Feature<
              GeoJSON.Point,
              GeoJSON.GeoJsonProperties
            >[],
          },
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        });

        map.loadImage(Other, function (error, image: any) {
          if (error) throw error;
          map.addImage("other", image);

          map.addLayer({
            id: "other",
            type: "symbol",
            source: "earthquakes",
            filter: [
              "all",
              ["!", ["has", "point_count"]],
              ["==", ["get", "type"], "other"],
            ],
            layout: {
              "icon-image": "other",
              "icon-overlap": "always",
            },
          });
        });

        map.loadImage(Biosphere, function (error, image: any) {
          if (error) throw error;
          map.addImage("biosphere", image);
          map.addLayer({
            id: "biosphere",
            type: "symbol",
            source: "earthquakes",
            filter: [
              "all",
              ["!", ["has", "point_count"]],
              ["==", ["get", "type"], "biosphere"],
            ],
            layout: {
              "icon-image": "biosphere",
              "icon-overlap": "always",
            },
          });
        });

        map.loadImage(Lithosphere, function (error, image: any) {
          if (error) throw error;
          map.addImage("lithosphere", image);
          map.addLayer({
            id: "lithosphere",
            type: "symbol",
            source: "earthquakes",
            filter: [
              "all",
              ["!", ["has", "point_count"]],
              ["==", ["get", "type"], "lithosphere"],
            ],
            layout: {
              "icon-image": "lithosphere",
              "icon-overlap": "always",
            },
          });
        });

        map.loadImage(Atmosphere, function (error, image: any) {
          if (error) throw error;
          map.addImage("atmosphere", image);
          map.addLayer({
            id: "atmosphere",
            type: "symbol",
            source: "earthquakes",
            filter: [
              "all",
              ["!", ["has", "point_count"]],
              ["==", ["get", "type"], "atmosphere"],
            ],
            layout: {
              "icon-image": "atmosphere",
              "icon-overlap": "always",
            },
          });
        });

        map.loadImage(Hydrosphere, function (error, image: any) {
          if (error) throw error;
          map.addImage("hydrosphere", image);
          map.addLayer({
            id: "hydrosphere",
            type: "symbol",
            source: "earthquakes",
            filter: [
              "all",
              ["!", ["has", "point_count"]],
              ["==", ["get", "type"], "hydrosphere"],
            ],
            layout: {
              "icon-image": "hydrosphere",
              "icon-overlap": "always",
            },
          });
        });

        map.loadImage(Weather, function (error, image: any) {
          if (error) throw error;
          map.addImage("weather", image);
          map.addLayer({
            id: "weather",
            type: "symbol",
            source: "earthquakes",
            filter: [
              "all",
              ["!", ["has", "point_count"]],
              ["==", ["get", "type"], "weather"],
            ],
            layout: {
              "icon-image": "weather",
              "icon-overlap": "always",
            },
            paint: {
              "icon-color": "#1a7a08",
              "icon-halo-color": "#e4be8b",
              "icon-halo-width": 4,
            },
          });
        });

        map.loadImage(Space, function (error, image: any) {
          if (error) throw error;
          map.addImage("space", image);
          map.addLayer({
            id: "space",
            type: "symbol",
            source: "earthquakes",
            filter: [
              "all",
              ["!", ["has", "point_count"]],
              ["==", ["get", "type"], "space"],
            ],
            layout: {
              "icon-image": "space",
              "icon-overlap": "always",
            },
          });
        });

        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "earthquakes",
          filter: ["has", "point_count"],
          paint: {
            // Use step expressions (https://maplibre.org/maplibre-gl-js-docs/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "earthquakes",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-size": 12,
          },
        });

        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "earthquakes",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#11b4da",
            "circle-radius": 8,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });

        // inspect a cluster on click
        map.on("click", "clusters", function (e: any) {
          var features: any = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          var clusterId = features[0].properties.cluster_id;
          const source: GeoJSONSource = map.getSource(
            "earthquakes"
          ) as GeoJSONSource;
          source.getClusterExpansionZoom(
            clusterId,
            function (err: any, zoom: any) {
              if (err) return;

              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
              });
            }
          );
        });

        // When user clicks a point, show the info bar.
        map.on("click", "unclustered-point", (e: any) => {
          e.preventDefault();
          const id = e.features[0].id;
          console.log();
          setInfoBarState("show");
          getAccessTokenSilently().then((token) => {
            getPost(token, id).then((res) => {
              console.log(res.post.tags);
              setDescription(res.post.description);
              setType(res.post.type);
              setTags(res.post.tags);
              setFileIds(res.fileIds);
            });
          });
        });

        // When user clicks the map not on a point, hide the info bar.
        map.on("click", (e: any) => {
          // Make sure click was not from a point.
          if (!e.defaultPrevented) {
            setInfoBarState("hide");
          }
        });

        map.on("mouseenter", "clusters", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "clusters", () => {
          map.getCanvas().style.cursor = "";
        });

        map.on("mouseenter", "unclustered-point", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "unclustered-point", () => {
          map.getCanvas().style.cursor = "";
        });
      });

      mapRef.current = map;
    });
  }, []);

  return (
    <div className="relative overflow-hidden w-full h-full">
      <div ref={mapContainer} className="h-full"></div>
      <div
        className={`fixed z-10 w-full h-4/6 top-full md:top-0 md:-left-96 md:w-96 md:h-screen bg-white ${
          infoBarState === "show" && "animate-slideup md:animate-slidein"
        } ${
          infoBarState === "hide" && "animate-slidedown md:animate-slideout"
        }`}
      >
        <button
          className={`p-2 absolute -top-8 right-[calc(50%-32px)] md:top-[calc(50%-16px)] md:-right-8 w-16  md:w-8 h-8  md:h-16 bg-white bg-center bg-no-repeat bg-[length:32px_32px] rounded-t-lg md:rounded-none md:rounded-r-lg ${
            infoBarState === "show"
              ? "bg-downarrow md:bg-leftarrow"
              : "bg-uparrow md:bg-rightarrow"
          } `}
          onClick={() => {
            setInfoBarState(infoBarState === "show" ? "hide" : "show");
          }}
        />
        {fileIds.length > 0 && (
          <div className="w-96 h-48 flex items-center justify-center">
            <iframe
              src={`${process.env.REACT_APP_API_SERVER_URL}/files/${fileIds[0]}`}
              className="border-none"
            ></iframe>
          </div>
        )}
        <div>
          <p className="text-xl text-green-600">Description</p>
          <p>{description}</p>
        </div>
        <div>
          <p className="text-xl text-green-600">Type</p>
          <p>{type}</p>
        </div>
        <div>
          <p className="text-xl text-green-600">Tags</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <div
                  key={i + tag}
                  className="flex gap-2 bg-gray-100 text-gray-600 p-2 rounded-lg"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapLibre;
