

const taskEnd = (symbol: symbol) => {
    const startTime = Symbol.keyFor(symbol)
    if (startTime) return performance.now() - Number(startTime)
    throw new Error('can not find taskId')
}

export default taskEnd