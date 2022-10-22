


const insert = (list: Array<string>) => {
    const { length } = list
    for (let i = 1; i < length; i++) {
        let preIndex = i - 1
        const current = list[i]
        while (preIndex >= 0 && list[preIndex] > current) {
            list[preIndex + 1] = list[preIndex]
            preIndex--
        }
        list[preIndex + 1] = current
    }
    return list
}

export default insert