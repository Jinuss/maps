import Map from "ol/Map";
import Feature from "ol/Feature";
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
  Icon,
} from "ol/style";
import { Point } from "ol/geom";
import { Cluster, Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { MapTools } from "./index";
import { convertToRGBA } from "../../../util";
export class ClusterTools {
  mapTool: MapTools;
  map: Map;
  markers: Array<Feature> = [];
  markersLimitNum: number = 1000;
  clusterslayer!: VectorLayer;
  clusterSource: Cluster;
  constructor({
    mapTool,
    markersLimitNum = 50,
  }: {
    mapTool: MapTools;
    markersLimitNum: number;
  }) {
    this.mapTool = mapTool;
    this.map = mapTool.map;
    this.markersLimitNum = markersLimitNum;
  }
  createMarkers() {
    let extent = this.map.getView().calculateExtent(this.map.getSize());
    let temp = [];
    for (let i = 0; i < this.markersLimitNum; i++) {
      // 生成随机经纬度
      const lon = Math.random() * (extent[2] - extent[0]) + extent[0]; // 经度在 [-180, 180] 范围内
      const lat = Math.random() * (extent[3] - extent[1]) + extent[1]; // 纬度在 [-90, 90] 范围内

      // 创建一个新的标记
      const marker = new Feature({
        geometry: new Point([lon, lat]),
      });

      temp.push(marker);
    }
    if (!this.clusterSource) {
      this.initCluster(temp);
    } else {
      this.clusterSource.clear();
      this.markers.push(...temp);
      this.clusterSource?.setSource(
        new VectorSource({ features: this.markers })
      );
    }
  }
  initCluster(temp: { temp: Array<Feature>[] }) {
    this.clusterSource = new Cluster({
      distance: 150,
      minDistance: 20,
      source: new VectorSource({
        features: temp,
      }),
    });
    this.markers = temp;
    const styleCache: object = {};

    this.clusterslayer = new VectorLayer({
      source: this.clusterSource,
      style: function (feature) {
        const size = feature.get("features")?.length;
        let style = styleCache[size];
        if (!style && size) {
          if (size == 1) {
            style = new Style({
              image: new Icon({
                src: "https://openlayers.org/en/latest/examples/data/icon.png", // 你可以替换为自己的图标
                scale: 0.5,
              }),
            });
          } else {
            style = new Style({
              image: new CircleStyle({
                radius: 20,
                stroke: new Stroke({
                  color: "#fff",
                  width: 2,
                }),
                fill: new Fill({
                  color: convertToRGBA(1, "#3399CC"),
                }),
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({
                  color: "#fff",
                }),
              }),
            });
          }
          styleCache[size] = style;
        }
        return style;
      },
    });

    this.map.addLayer(this.clusterslayer);
  }
  remove() {
    this.map.removeLayer(this.clusterslayer);
  }
}
