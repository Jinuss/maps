import Map from "ol/Map";
import { GeoJSON } from "ol/format";
import Mask from "ol-ext/filter/Mask";
import Crop from "ol-ext/filter/Crop";
import { Fill } from "ol/style";
import { MapTools } from "./index";
import geojson from "../assets/hongshang.json";

export class MaskTools {
  mapTool: MapTools;
  map: Map;
  mask: Mask;
  crop: Crop;
  constructor({ mapTool }: { mapTool: MapTools }) {
    this.mapTool = mapTool;
    this.map = mapTool.map;
    this.initMaskMAp();
  }
  initMaskMAp() {
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

    this.mask = new Mask({
      feature: f,
      wrapX: true,
      inner: false,
      fill: new Fill({ color: [255, 255, 255, 0.1] }),
    });
    this.crop = new Crop({
      feature: f,
      wrapX: true,
      inner: false,
    });

    this.mapTool.layers.AMAP_LAYER.addFilter(this.mask);
    this.mapTool.layers.AMAP_LAYER.addFilter(this.crop);
    this.map.getView().setZoom(11);
  }
  remove() {
    this.mapTool.layers.AMAP_LAYER.removeFilter(this.mask);
    this.mapTool.layers.AMAP_LAYER.removeFilter(this.crop);
    this.map.getView().setZoom(5);
  }
}
