import { Coordinate } from "ol/coordinate";
import Feature from "ol/Feature";
import { Point } from "ol/geom";

export class MapTools {
  map: any = null;
  layers: any = null;
  type: string = "";
  handle: any = () => {};
  constructor(map: any, layers: any, type: string) {
    this.map = map;
    this.layers = layers;
    this.type = type;
    this.handle =  (event: { coordinate: any }) => {
      // 获取点击位置的坐标
      const coord = event.coordinate;
      console.log("🚀 ~ MapTools ~ constructor ~ coord:", coord);
      this.addMarker(coord);
    };
  }
  addListener(type: any) {
    const that = this;
    // 创建一个点击事件监听器
    switch (type) {
      case "point":
        this.map.on("click", this.handle);
        break;
    }
  }
  addMarker(coordinate: Coordinate) {
    let marker = new Feature({
      geometry: new Point(coordinate),
    });
    this.layers.vectorLayer.getSource().addFeature(marker);
  }
  removeListener() {
    this.map.un("click", this.handle);
  }
}
