// 基本类型
export const TYPES = {
  POINT: "Point",
  LINESTRING: "LineString",
  POLYGON: "Polygon",
  CIRCLE: "Circle",
  RECT: "Rect",
  MEASUREDISTANCE: "MEASUREDISTANCE",
  MEASUREPOLYGON: "MEASUREPOLYGON",
};

//专题图类型
export const TOPICTYPES = {
  TOPICTYPES: "TOPICTYPES",
};

//卡片标题
export const CARD_TITLE = {
  Point: "标点",
  LineString: "标线",
  Polygon: "标面",
  Circle: "画圆",
  Rect: "画矩形",
};

// 标线 线条样式
export const LINE_FORM_LINE_STYLES = [
  {
    value: "line_1",
  },
  {
    value: "line_2",
  },
  {
    value: "line_3",
  },
  {
    value: "line_4",
  },
  {
    value: "line_5",
  },
  {
    value: "line_6",
  },
  {
    value: "line_7",
  },
  {
    value: "line_8",
  },
];

export const INIT_LINE_STATE = {
  name: "未命名",
  mark: "",
  lineStyle: "line_1",
  color: "#ff0000",
  width: 2,
};

export const INIT_PLOYGON_STATE = {
  name: "未命名",
  mark: "",
  color: "#ff0000",
  width: 2,
  opacity: 30,
};

export const INIT_CIRCLE_STATE = {
  name: "未命名",
  mark: "",
  color: "#ff0000",
  width: 2,
  opacity: 30,
};
