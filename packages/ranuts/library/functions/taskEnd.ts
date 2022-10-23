

const taskEnd = (symbol:symbol) => {
    const startTime = Symbol.keyFor(symbol)
    if(startTime){
        const endTime = performance.now()
        return endTime - Number(startTime)
    }
    throw new Error('can not find task start')
}

export default taskEnd