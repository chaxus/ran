const startTask = ():symbol => {
  const startTime = performance.now()
  return Symbol.for(`${startTime}`)
}

export default startTask
