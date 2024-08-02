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
