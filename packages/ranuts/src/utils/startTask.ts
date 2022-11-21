

const startTask = () => {
    const startTime = performance.now()
    return Symbol.for(`${startTime}`)
}

export default startTask