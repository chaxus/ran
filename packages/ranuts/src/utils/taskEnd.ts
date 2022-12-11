const taskEnd = (symbol: symbol):number => {
  const startTime = Symbol.keyFor(symbol)
  if (startTime) return performance.now() - Number(startTime)
  throw new Error('can not find taskId')
}

export default taskEnd
