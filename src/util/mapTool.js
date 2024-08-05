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