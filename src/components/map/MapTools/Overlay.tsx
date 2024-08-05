import Overlay from "ol/Overlay";
import Map from "ol/Map";
import { Coordinate } from "ol/coordinate";
import { v4 as uuidv4 } from "uuid";

/**
 * 创建over字符串
 * @param content
 * @param uuid
 * @returns
 */
const createOverlayElement = (content: string, uuid: string) => {
  var element = document.createElement("div");
  element.className = `popMarker`;
  element.id = `marker_${uuid}`;
  element.innerHTML = content;
  return element;
};

interface overlayProps {
  map: Map;
  coordinate: Coordinate;
  uuid: string;
}

export const createOverlay = ({
  map,
  coordinate,
  uuid,
}: overlayProps): Overlay => {
  uuid = uuid || uuidv4().replace(/-/g, "");
  var overlay = new Overlay({
    element: createOverlayElement("Your text content", uuid), // 创建 overlay 的内容
    positioning: "bottom-center",
    offset: [15, -30],
    position: coordinate,
  });

  map.addOverlay(overlay);
  return overlay;
};
