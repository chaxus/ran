

const startTask = () => {
    const startTime = performance.now()
    const task = Symbol.for(`${startTime}`)
    return task
}

export default startTask