import { Coordinate } from "ol/coordinate";
import Map from "ol/Map";
import Feature from "ol/Feature";
import * as olStyle from "ol/style";
import { Point } from "ol/geom";
import Overlay from "ol/Overlay";
import { v4 as uuidv4 } from "uuid";
import { EventBus, getSVGForSrcById } from "../../util/index.js";

// 创建 overlay 内容的函数
function createOverlayElement(content: string, uuid: string) {
  var element = document.createElement("div");
  element.className = `popMarker`;
  element.id = `marker_${uuid}`;
  element.innerHTML = content;
  return element;
}
export class MapTools {
  map: Map;
  layers: any = null;
  type: string = "";
  handle: any = () => {};
  callback: Function = () => {};
  mapEl = document.querySelector(".ol-viewport");
  uuid: string = "";

  constructor(
    map: any,
    layers: any,
    type: string,
    callback: Function = () => {}
  ) {
    this.map = map;
    this.layers = layers;
    this.type = type;
    this.handle = (event: { coordinate: any }) => {
      const coord = event.coordinate;
      this.uuid = uuidv4().replace(/-/g, "");
      const marker = this.addMarker(coord);
      const overlay = this.addOverlay(coord);

      this.removeListener();
      EventBus.emit("cancel");

      this.callback({ operate: "add", type, uuid: this.uuid, marker, overlay });
      this.map.on("click", (event: { pixel: any }) => {
        this.map.forEachFeatureAtPixel(event.pixel, (feature: any) => {
          if (feature instanceof Feature) {
            const featureId = feature.get("id");
            if (featureId) {
              this.callback({ operate: "click", uuid: featureId });
            }
          }
        });
      });
    };
    this.callback = callback;
  }
  addListener(type: any) {
    const that = this;
    that.mapEl?.classList.add("draw");
    // 创建一个点击事件监听器
    switch (type) {
      case "point":
        that.map.on("click", that.handle);
        break;
    }
  }
  addOverlay(coordinate: Coordinate) {
    var overlay = new Overlay({
      element: createOverlayElement("Your text content", this.uuid), // 创建 overlay 的内容
      positioning: "bottom-center",
      offset: [15, -30],
      position: coordinate,
    });

    this.map.addOverlay(overlay);
    return overlay;
  }
  addMarker(coordinate: Coordinate) {
    const that = this;
    let marker = new Feature({
      id: that.uuid,
      geometry: new Point(coordinate),
    });

    var markerStyle = new olStyle.Style({
      image: new olStyle.Icon({
        anchor: [0.5, 1],
        src: getSVGForSrcById({}),
        scale: 1,
      }),
    });
    marker.setStyle(markerStyle);
    that.layers.vectorLayer.getSource().addFeature(marker);

    return marker;
  }
  removeListener() {
    this.mapEl?.classList.remove("draw");
    this.map.un("click", this.handle);
  }
}
