import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";

export const LAYER_NAMES = {
  AMAP_LAYER: "AMAP_LAYER",
  GOOGLE_LAYER: "GOOGLE_LAYER",
  VECTOR_LAYER: "VECTOR_LAYER",
};

/**矢量图地址 */
export const AMAP_URL =
  "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"; //矢量图

/**影像图地址 */
export const GOOGLE_URL =
  "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}";

export const AMAP_LAYER = new TileLayer({
  source: new XYZ({ url: AMAP_URL }),
  className: LAYER_NAMES.AMAP_LAYER,
});

export const GOOGLE_LAYER = new TileLayer({
  source: new XYZ({ url: GOOGLE_URL }),
  className: LAYER_NAMES.GOOGLE_LAYER,
  visible: false,
});

export const VECTOR_LAYER = new VectorLayer({
  source: new VectorSource(),
  className: LAYER_NAMES.VECTOR_LAYER,
});
