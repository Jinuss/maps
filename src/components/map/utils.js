export function getTileLayer(url, visible) {
    return new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: url,
        wrapX: false,
      }),
    });
  }