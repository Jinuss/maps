import Map from "ol/Map";
import Feature from "ol/Feature";
import {Style,Circle,Fill} from "ol/style";
import * as DayNight from "ol-ext/source/DayNight";
import { Vector as VectorLayer, Image as ImageLayer } from "ol/layer";
import { MapTools } from "./index";

export class TimeTools {
  mapTool: MapTools;
  map: Map;
  markers: Array<Feature> = [];
  constructor({ mapTool }: { mapTool: MapTools }) {
    this.mapTool = mapTool;
    this.map = mapTool.map;
    this.initHeatMap();
  }
  initHeatMap() {
    // DayNight source
    var vectorSource = new DayNight.default({});

    this.map.addLayer(
      new VectorLayer({
        source: vectorSource,
        style: new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: "red" }),
          }),
          fill: new Fill({
            color: [0, 0, 50, 0.5],
          }),
        }),
      })
    );
  }
}
