import Map from "ol/Map";
import Feature from "ol/Feature";
import { GeoJSON } from "ol/format";
import * as IDW from "ol-ext/source/IDW";
import Mask from "ol-ext/filter/Mask";
import Crop from "ol-ext/filter/Crop";
import { transform } from "ol/proj";
import { Point } from "ol/geom";
import { Style, Text, Stroke, Fill } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer, Image as ImageLayer } from "ol/layer";
import { MapTools } from "./index";
import geojson from "../assets/hongshang.json";

export class MaskTools {
  mapTool: MapTools;
  map: Map;
  constructor({ mapTool }: { mapTool: MapTools }) {
    this.mapTool = mapTool;
    this.map = mapTool.map;
    this.initHeatMap();
  }
  initHeatMap() {
    console.log("🚀 ~ features:", geojson);

    var f = new GeoJSON().readFeature(geojson.features[0]);
    const transformedCoords = f
      .getGeometry()
      .getCoordinates()
      .map((ring) =>
        ring.map((coords) =>
          coords.map((coord) => {
            var longitude = coord[0],
              latitude = coord[1];
            var xValue = (longitude * 20037508.34) / 180;
            var y =
              Math.log(Math.tan(((90 + latitude) * Math.PI) / 360)) /
              (Math.PI / 180);
            var yValue = (y * 20037508.34) / 180;
            return [xValue, yValue];
          })
        )
      );

    // 更新 Feature 的坐标
    f.getGeometry().setCoordinates(transformedCoords);

    var mask = new Mask({
      feature: f,
      wrapX: true,
      inner: false,
      fill: new Fill({ color: [255, 255, 255, 0.1] }),
    });
    var crop = new Crop({
      feature: f,
      wrapX: true,
      inner: false,
    });

    this.mapTool.layers.AMAP_LAYER.addFilter(mask);
    this.mapTool.layers.AMAP_LAYER.addFilter(crop);
  }
}
