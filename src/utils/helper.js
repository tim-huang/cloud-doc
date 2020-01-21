
export const flattenArr = (arr, key) => {
    return arr.reduce((map, e) => {
        map[e[key || 'id']] = e
        return map
    }, {})
}

export const objToArr = (obj) => {
    return Object.keys(obj).map(key => obj[key])
}