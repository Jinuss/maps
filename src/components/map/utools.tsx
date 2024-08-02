import { Coordinate } from "ol/coordinate";
import Map from "ol/Map";
import Feature from "ol/Feature";
import * as olStyle from "ol/style";
import { Point } from "ol/geom";
import Overlay from "ol/Overlay";
import { Draw } from "ol/interaction";
import { getDistance } from "ol/sphere";
import { transform } from "ol/proj";
import { v4 as uuidv4 } from "uuid";
import { unByKey } from "ol/Observable";
import {
  EventBus,
  getSVGForSrcById,
  formatLength,
  formatDistance,
} from "../../util";

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
    that.type = type;
    that.mapEl?.classList.add("draw");
    // 创建一个点击事件监听器
    switch (type) {
      case "point":
        that.map.on("click", that.handle);
        break;
      case "measure-distance":
        that.initInteraction();
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

  style1 = new olStyle.Style({
    stroke: new olStyle.Stroke({
      color: "red",
      width: 3,
    }),
  });

  draw: Draw | undefined;
  listener: Function | undefined;
  initInteraction() {
    this.draw = new Draw({
      source: this.layers.vectorLayer.getSource(),
      type: "LineString",
      style: this.style1,
    });
    this.map.addInteraction(this.draw);

    this.draw.on("drawstart", this.handleMeasureLineStart.bind(this));
    this.draw.on("drawend", this.handleMeasureLineEnd.bind(this));
  }
  measureTooltip: Overlay | undefined;
  createMeasureTooltip() {
    const measureTooltipElement = document.createElement("div");
    measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    this.measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
      stopEvent: false,
      insertFirst: false,
    });
    this.map.addOverlay(this.measureTooltip);
  }
  sketch: Feature | undefined;
  handleMeasureLineStart(evt: { feature: Feature; coordinate: Coordinate }) {
    let measureLine = {};
    this.createMeasureTooltip();
    this.sketch = evt.feature;
    let tooltipCoord = evt.coordinate;
    this.listener = this.sketch.getGeometry().on("change", (evt) => {
      const geom = evt.target;
      let output = formatLength(geom);
      tooltipCoord = geom.getLastCoordinate(); // 折线的最后一个点的坐标
      this.measureTooltip.getElement().innerHTML = "总长" + output; // 显示计算后的距离
      this.measureTooltip.setPosition(tooltipCoord); // 设置overlay位置显示在折线的末端
      // // 展示分段距离
      const coordinates = geom.getCoordinates().slice(0, -1);
      console.log(
        "🚀 ~ MapTools ~ this.listener=this.sketch.getGeometry ~ geom.getCoordinates():",
        geom.getCoordinates()
      );
      measureLine = geom.getCoordinates();
      // 获取折线的每段线段 给除了最后一段线段增加距离显示
      for (let i = 0; i < coordinates.length; i++) {
        const start = coordinates[i]; // 折线起点
        const end = coordinates[i + 1]; // 折线终点
        if (!end) {
          continue;
        }
        if (tooltipCoord.join("") != end.join("")) {
          const start4326 = transform(start, "EPSG:3857", "EPSG:4326");
          const end4326 = transform(end, "EPSG:3857", "EPSG:4326");
          const distance = getDistance(start4326, end4326);
          this.putOverlayToLine(end, formatDistance(distance));
        }

        const point = new Point(start);
        const pointFeature = new Feature({
          geometry: point,
        });
        pointFeature.setStyle(
          new olStyle.Style({
            image: new olStyle.Circle({
              radius: 5,
              stroke: new olStyle.Stroke({
                color: "red",
                width: 2,
              }),
              fill: new olStyle.Fill({
                color: "#fff",
              }),
            }),
          })
        );
        this.layers.vectorLayer.getSource().addFeature(pointFeature);
      }
    });
  }
  putOverlayToLine(coordinate: Coordinate, text: string) {
    const div = document.createElement("div");
    div.className = "ol-tooltip ol-tooltip-measure";
    div.innerHTML = text;
    const overlay = new Overlay({
      element: div,
      offset: [0, -15],
      positioning: "bottom-center",
      stopEvent: false,
    });
    this.map.addOverlay(overlay); // 将Overlay添加到地图
    overlay.setPosition(coordinate); // 设置Overlay的位置
  }
  handleMeasureLineEnd(evt: { feature: Feature }) {
    // 显示距离的div设置类名
    this.measureTooltip.getElement().className = "ol-tooltip ol-tooltip-static";
    this.measureTooltip.setOffset([0, -7]);
    evt.feature.setStyle(this.style1); // 设置折线样式
    unByKey(this.listener); // 解绑change事件
    this.sketch = null;
    this.map.removeInteraction(this.draw);
    this.measureTooltip = null;
  }
}
