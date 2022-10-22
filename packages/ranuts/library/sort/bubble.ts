
/**
 * @description: 冒泡排序
 * @param {Array} list
 * @return {Array}
 */
const bubble = (list:Array<number>) => {
    const length = list.length
    for(let i = 0; i < length; i++){
        for(let j = 0; j < length; j++){
            let temp
            if(list[i] > list[j]){
                temp = list[j]
                list[j] = list[i]
                list[i] = temp
            }
        }
    }
    return list
}

export default bubble