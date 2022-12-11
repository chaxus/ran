type Obj = Record<string, any>

const merge = (a: Obj, b: Obj) => {
  if (a && b) {
    for (let key in b) {
      a[key] = b[key]
    }
  }
  return a
}

export default merge
