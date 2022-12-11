type Obj = Record<string, any>

const merge = (a: Obj, b?: Obj): Obj => {
  if (a && b) {
    for (const key in b) {
      a[key] = b[key]
    }
  }
  return a
}

export default merge
