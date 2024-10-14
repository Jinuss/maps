import { Coordinate } from "ol/coordinate";
import Map from "ol/Map";
import Feature from "ol/Feature";
import * as olStyle from "ol/style";
import { Point } from "ol/geom";
import Overlay from "ol/Overlay";
import { Draw, Interaction } from "ol/interaction";
import { createRegularPolygon, createBox } from "ol/interaction/Draw";
import { getDistance } from "ol/sphere";
import { transform } from "ol/proj";
import { v4 as uuidv4 } from "uuid";
import { unByKey } from "ol/Observable";
import {
  EventBus,
  getSVGForSrcById,
  formatLength,
  formatDistance,
  getArea,
} from "../../../util";
import { TYPES } from "../../../const/const.map";

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

  constructor(map: any, layers: any, callback: Function = () => {}) {
    this.map = map;
    this.layers = layers;
    const coordinateEl: Element | null = document.querySelector(".brp");
    this.map.on("pointermove", (evt) => {
      var lonLat = transform(evt.coordinate, "EPSG:3857", "EPSG:4326");
      if (lonLat && lonLat.length && coordinateEl) {
        var lon = ((((lonLat[0] + 180) % 360) + 360) % 360) - 180;
        coordinateEl.innerHTML = `经度: ${lon.toFixed(
          3
        )}, 纬度: ${lonLat[1].toFixed(3)}`;

        coordinateEl.style.display = "block";
      }
    });

    this.map.on("click", (event: { pixel: any }) => {
      var features = this.map.getFeaturesAtPixel(event.pixel);
      if (features && !!features.length) {
        let feature = features[0];
        if (feature instanceof Feature) {
          const featureId = feature.getId("id") || feature.get("id");
          if (featureId) {
            this.callback({ operate: "click", uuid: featureId });
          }
        }
      }
    });

    this.handle = (event: { coordinate: any }) => {
      const coord = event.coordinate;
      const marker = this.addMarker(coord);
      const overlay = this.addOverlay(coord);

      this.removeListener();
      EventBus.emit("cancel");

      this.callback({
        operate: "add",
        type: this.type,
        uuid: this.uuid,
        marker,
        overlay,
      });
    };
    this.callback = callback;
  }
  addListener(type: any) {
    const that = this;
    that.uuid = uuidv4().replace(/-/g, "");
    that.type = type;
    that.mapEl?.classList.add("draw");
    switch (type) {
      case TYPES.POINT:
        that.map.on("click", that.handle);
        break;
      case TYPES.LINESTRING:
      case TYPES.POLYGON:
      case TYPES.CIRCLE:
      case TYPES.RECT:
        that.initInteractionBase(type);
        break;
      case TYPES.MEASUREDISTANCE:
        that.initInteraction();
        break;
      case TYPES.MEASUREPOLYGON:
        that.initInteractionPolygon();
        break;
      case "clear":
        this.removeAll();
        break;
    }
  }
  removeAll() {
    var source = this.layers.vectorLayer.getSource();
    var features = source.getFeatures();

    for (var i = 0; i < features.length; i++) {
      source.removeFeature(features[i]);
    }
  }
  addOverlay(coordinate: Coordinate) {
    var overlay = new Overlay({
      element: createOverlayElement("Your text content", this.uuid), // 创建 overlay 的内容
      positioning: "bottom-center",
      offset: [15, -30],
      position: coordinate,
      autoPan: true, // 如果弹窗在底图边缘时，底图会移动
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
    this.map.un("click", this.handle);
  }

  style1 = new olStyle.Style({
    stroke: new olStyle.Stroke({
      color: "red",
      width: 3,
    }),
  });

  style2 = new olStyle.Style({
    stroke: new olStyle.Stroke({
      color: "red",
      width: 2,
    }),
    fill: new olStyle.Fill({
      color: "rgba(255, 0, 0, 0.2)",
    }),
  });

  draw: Interaction | undefined;
  listener: Function = () => {};
  initInteractionBase(type: string) {
    if ([TYPES.CIRCLE, TYPES.RECT].includes(type)) {
      this.draw = new Draw({
        source: this.layers.vectorLayer.getSource(),
        type: "Circle",
        style: this.style2,
        geometryFunction:
          type === TYPES.CIRCLE ? createRegularPolygon(400) : createBox(),
      });
    } else {
      this.draw = new Draw({
        source: this.layers.vectorLayer.getSource(),
        type: type,
        style: this.style2,
      });
    }
    this.map.addInteraction(this.draw);
    this.draw.on("drawend", (evt: { feature: Feature }) => {
      console.log("🚀 ~ MapTools ~ this.draw.on ~ this.uuid:", this.uuid);
      evt.feature.setStyle(this.style2);
      evt.feature.setId(this.uuid);
      this.map.removeInteraction(this.draw);
      EventBus.emit("cancel");
      this.callback({
        operate: "add",
        type,
        uuid: this.uuid,
        feature: evt.feature,
      });
    });
  }
  formatPonit(coordinate: Coordinate) {
    const point = new Point(coordinate);
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
    this.createMeasureTooltip();
    this.sketch = evt.feature;
    let tooltipCoord = evt.coordinate;
    this.listener = this.sketch.getGeometry().on("change", (evt) => {
      const geom = evt.target;
      // let measureLine = {};
      let output = formatLength(geom);
      let startPoint = geom.getFirstCoordinate();
      this.addMarker(startPoint);
      tooltipCoord = geom.getLastCoordinate(); // 折线的最后一个点的坐标
      console.log(
        "🚀 ~ MapTools ~ this.listener=this.sketch.getGeometry ~ tooltipCoord:",
        tooltipCoord
      );
      this.measureTooltip.getElement().innerHTML = "总长" + output; // 显示计算后的距离
      this.measureTooltip.setPosition(tooltipCoord); // 设置overlay位置显示在折线的末端
      // // 展示分段距离
      const coordinates = geom.getCoordinates().slice(0, -1);
      console.log(
        "🚀 ~ MapTools ~ this.listener=this.sketch.getGeometry ~ geom.getCoordinates():",
        geom.getCoordinates()
      );
      // measureLine = geom.getCoordinates();
      // 获取折线的每段线段 给除了最后一段线段增加距离显示
      for (let i = 0; i < coordinates.length; i++) {
        const start = coordinates[i]; // 折线起点
        this.formatPonit(start);
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
    this.mapEl?.classList.remove("draw");
    this.measureTooltip = null;
    EventBus.emit("cancel");
  }
  initInteractionPolygon() {
    this.draw = new Draw({
      source: this.layers.vectorLayer.getSource(),
      type: "Polygon",
      style: this.style2,
    });
    this.map.addInteraction(this.draw);

    this.draw.on(
      "drawstart",
      (evt: { feature: Feature; coordinate: Coordinate }) => {
        this.createMeasureTooltip();
        this.sketch = evt.feature;
        this.listener = this.sketch.getGeometry().on("change", (evt) => {
          const geom = evt.target;
          let output = getArea(geom, false);
          const coordinates = geom.getCoordinates()[0];
          if (output > 0) {
            let tooltipCoord = coordinates[coordinates.length - 2];
            this.measureTooltip.getElement().innerHTML =
              "总面积" + getArea(geom);
            this.measureTooltip.setPosition(tooltipCoord);
          }
        });
      }
    );
    this.draw.on("drawend", (evt: { feature: Feature }) => {
      // 显示距离的div设置类名
      this.measureTooltip.getElement().className =
        "ol-tooltip ol-tooltip-static";
      this.measureTooltip.setOffset([0, -7]);
      evt.feature.setStyle(this.style2);
      let coordinates = evt.feature.getGeometry()?.getCoordinates()[0];
      for (let index = 0; index < coordinates.length; index++) {
        this.formatPonit(coordinates[index]);
      }
      unByKey(this.listener);
      this.sketch = null;
      this.map.removeInteraction(this.draw);
      this.mapEl?.classList.remove("draw");
      this.measureTooltip = null;
      EventBus.emit("cancel");
    });
  }
}
