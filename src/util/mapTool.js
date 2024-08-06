import * as sphere from 'ol/sphere'

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