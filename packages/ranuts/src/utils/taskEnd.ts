import { hrtime } from 'node:process'

const taskEnd = (symbol: symbol): number | bigint => {
  if(typeof window !== 'undefined'){
    const startTime = Symbol.keyFor(symbol)
    if (startTime) return window.performance.now() - Number(startTime)
  }
  if(typeof process !== 'undefined'){
    const startTime = Symbol.keyFor(symbol)
    if (startTime) return hrtime.bigint() - BigInt(startTime)
  }
  return Date.now() - Number(Symbol.keyFor(symbol))
}

export default taskEnd
