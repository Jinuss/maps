import Map from "ol/Map";
import Feature from "ol/Feature";
import * as IDW from "ol-ext/source/IDW";
import { Point } from "ol/geom";
import { Style, Text, Stroke } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer, Image as ImageLayer } from "ol/layer";
import { MapTools } from "./index";

export class HeatMapTools {
  mapTool: MapTools;
  map: Map;
  markers: Array<Feature> = [];
  markersLimitNum: number = 1000;
  idwSource: IDW;
  idwLayer!: ImageLayer;
  vecLayer!: VectorLayer;
  constructor({ mapTool }: { mapTool: MapTools; markersLimitNum: number }) {
    this.mapTool = mapTool;
    this.map = mapTool.map;
    this.initHeatMap();
  }
  initHeatMap() {
    this.idwSource = new IDW.default({
      source: new VectorSource(),
      weight: "weightVal",
    });

    this.idwLayer = new ImageLayer({
      source: this.idwSource,
      opacity: 0.5,
    });

    this.map.addLayer(this.idwLayer);
    this.vecLayer = new VectorLayer({
      source: this.idwSource.getSource(),
      style: function (f) {
        return new Style({
          text: new Text({
            text: f.get("weightVal").toString(),
            stroke: new Stroke({ color: [255, 255, 255, 128], width: 1.25 }),
          }),
        });
      },
    });

    this.map.addLayer(this.vecLayer);
  }

  addFeatures() {
    const size = this.markersLimitNum || 100;
    var ext = this.map.getView().calculateExtent();
    var dx = ext[2] - ext[0];
    var dy = ext[3] - ext[1];
    var features = [];
    for (var i = 0; i < size; ++i) {
      var f = new Feature(
        new Point([ext[0] + dx * Math.random(), ext[1] + dy * Math.random()])
      );
      f.set("weightVal", Math.round(Math.random() * 100));
      features.push(f);
    }
    this.idwSource.getSource().addFeatures(features);
  }

  remove() {
    this.map.removeLayer(this.vecLayer);
    this.map.removeLayer(this.idwLayer);
  }
}
