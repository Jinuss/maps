import Map from "ol/Map";
import AnimatedCanvas from "ol-ext/overlay/AnimatedCanvas";
import Cloud from "ol-ext/particule/Cloud";
import Snow from "ol-ext/particule/Snow";
import RainDrop from "ol-ext/particule/RainDrop";
import Rain from "ol-ext/particule/Rain";
import { MapTools } from "./index";

export class WeatherTools {
  mapTool: MapTools;
  map: Map;
  constructor({ mapTool }: { mapTool: MapTools }) {
    this.mapTool = mapTool;
    this.map = mapTool.map;
    this.initWeatherMap();
  }
  initWeatherMap() {
    this.mapTool.layers.AMAP_LAYER.setVisible(false);
    this.mapTool.layers.GOOGLE_LAYER.setVisible(true);

    // cloud
    var cloud = new AnimatedCanvas({
      particule: Cloud,
      density: 1.5,
      angle: Math.PI / 4,
      speed: 2,
    });
    this.map.addOverlay(cloud);

    //snow
    var snow = new AnimatedCanvas({
      particule: Snow,
      density: 5,
      angle: Math.PI / 2,
      speed: 0.5,
    });

    snow.setVisible(false);
    this.map.addOverlay(snow);

    // rainDrop
    var raindrop = new AnimatedCanvas({
      particule: RainDrop,
      density: 1,
      speed: 5,
    });
    raindrop.setVisible(false);
    this.map.addOverlay(raindrop);

    // Rain
    var rain = new AnimatedCanvas({
      particule: Rain,
      density: 1,
      angle: (2 * Math.PI) / 5,
      speed: 5,
    });
    rain.setVisible(false);
    this.map.addOverlay(rain);
  }
}
