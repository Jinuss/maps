import * as sphere from 'ol/sphere';
import { Style, Stroke, Icon } from 'ol/style';
import { Point } from 'ol/geom'

export const formatDistance = (dis) => {
    if (dis > 100) {
        return Math.round((dis / 1000) * 100) / 100 + ' ' + 'km';
    } else {
        return Math.round(dis * 100) / 100 + ' ' + 'm';
    }
}

export const formatLength = (line) => {
    const length = sphere.getLength(line)
    return formatDistance(length)
}

export const formatArea = (area) => {
    if (area > 1000000) {
        return Math.round((area / 1000000) * 100) / 100 + ' ' + 'km²';
    } else {
        return Math.round(area * 100) / 100 + ' ' + 'm²';
    }
}

export const getArea = (geometry, format = true) => {
    const area = sphere.getArea(geometry)
    return format ? formatArea(area) : area
}

/**
 *  颜色值添加透明度
 * @param {*} opacity 透明度
 * @param {*} color 旧颜色值
 * @returns 
 */
export const convertToRGBA = (opacity, color) => {
    let rgbaColor = '';

    if (color.includes('rgba')) {
        rgbaColor = color.replace(/[\d\.]+\)$/g, opacity.toString() + ')');
    } else if (color.includes('rgb')) {
        const rgbValues = color.match(/\d+/g);
        const [r, g, b] = rgbValues.map(Number);
        rgbaColor = `rgba(${r},${g},${b},${opacity})`;
    } else {
        const tempDiv = document.createElement('div');
        tempDiv.style.color = color;
        document.body.appendChild(tempDiv);
        const computedColor = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);

        if (computedColor.startsWith('rgb')) {
            const rgbValues = computedColor.match(/\d+/g);
            const [r, g, b] = rgbValues.map(Number);
            rgbaColor = `rgba(${r},${g},${b},${opacity})`;
        } else {
            throw new Error('Invalid color value');
        }
    }

    return rgbaColor;
}

/**
 * 获取图像模板
 * @param {*} imgUrl  图像源
 * @param {*} opacity 透明度
 * @returns 
 */
export const getImagePattern = (imgUrl, opacity = 1) => {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.src = imgUrl;
        img.onload = function () {
            var cnv = document.createElement('canvas');
            var ctx = cnv.getContext('2d');
            cnv.width = img.width;
            cnv.height = img.height;
            ctx.drawImage(img, 0, 0);

            var imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);
            var data = imageData.data;

            for (var i = 3; i < data.length; i += 4) {
                data[i] = opacity * 255;
            }
            ctx.putImageData(imageData, 0, 0);
            var pattern = ctx.createPattern(cnv, 'repeat');
            resolve(pattern)
        };
        img.onerror = function (error) {
            reject(error);
        };
    })
}

export const getStyleFunction = ({ steps, color, width, imgsrc, scale, wrapperRotation }) => {
    steps = steps || 40
    scale = scale || 0.5
    return (feature, resolution) => {
        const geometry = feature.getGeometry()
        console.log("🚀 ~ return ~ resolution:", resolution)
        var styles = [
            new Style({
                stroke: new Stroke({
                    color: color,
                    width: width
                })
            })
        ];
        let length = geometry.getLength();
        let geo_steps = steps * resolution;
        let num = parseInt(length / geo_steps);
        for (let i = 1; i <= num; i++) {
            let fraction = i / (num + 1)
            let arraw_coor = geometry.getCoordinateAt(fraction);
            let previousCoordinate = geometry.getCoordinateAt(fraction - 0.001);
            let nextCoordinate = geometry.getCoordinateAt(fraction + 0.001);
            let rotation = Math.atan2(nextCoordinate[1] - previousCoordinate[1], nextCoordinate[0] - previousCoordinate[0]);
            styles.push(new Style({
                geometry: new Point(arraw_coor),
                image: new Icon({
                    src: imgsrc,
                    scale: scale,
                    anchor: [0.5, 0.5],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    rotation: wrapperRotation(rotation)
                })
            }));
        }
        return styles;
    }
}