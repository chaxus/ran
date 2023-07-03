console.log('[ranite] connecting...')

const socket = new WebSocket(`ws://localhost:__HMR_PORT__`, 'ranite-hmr')

socket.addEventListener('message', async ({ data }) => {
  handleMessage(JSON.parse(data)).catch(console.error)
})

interface Update {
  type: 'js-update' | 'css-update'
  path: string
  acceptedPath: string
  timestamp: number
}

async function handleMessage(payload: any) {
  switch (payload.type) {
    case 'connected':
      console.log(`[ranite] connected.`)
      setInterval(() => socket.send('ping'), 1000)
      break

    case 'update':
      payload.updates.forEach((update: Update) => {
        if (update.type === 'js-update') {
          fetchUpdate(update)
        }
      })
      break
  }
}

interface HotModule {
  id: string
  callbacks: HotCallback[]
}

interface HotCallback {
  deps: string[]
  fn: (modules: object[]) => void
}
// HMR 模块表
const hotModulesMap = new Map<string, HotModule>()
// 不在生效的模块表
const pruneMap = new Map<string, (data: any) => void | Promise<void>>()

export const createHotContext = (ownerPath: string): any => {
  const mod = hotModulesMap.get(ownerPath)
  if (mod) {
    mod.callbacks = []
  }

  function acceptDeps(deps: string[], callback: any) {
    const mod: HotModule = hotModulesMap.get(ownerPath) || {
      id: ownerPath,
      callbacks: [],
    }
    // callbacks 属性存放 accept 的依赖、依赖改动后对应的回调逻辑
    mod.callbacks.push({
      deps,
      fn: callback,
    })
    hotModulesMap.set(ownerPath, mod)
  }

  return {
    accept(deps: any) {
      // 这里仅考虑接受自身模块更新的情况
      // import.meta.hot.accept()
      if (typeof deps === 'function' || !deps) {
        acceptDeps([ownerPath], ([mod]) => deps && deps(mod))
      }
    },
    // 模块不再生效的回调
    // import.meta.hot.prune(() => {})
    prune(cb: (data: any) => void) {
      pruneMap.set(ownerPath, cb)
    },
  }
}
/**
 * @description: 客户端热更新的具体逻辑
 * @param {Update} param1
 * @return {*}
 */
async function fetchUpdate({ path, timestamp }: Update) {
  const mod = hotModulesMap.get(path)
  if (!mod) return

  const moduleMap = new Map()
  const modulesToUpdate = new Set<string>()

  modulesToUpdate.add(path)

  await Promise.all(
    Array.from(modulesToUpdate).map(async (dep) => {
      const [path, query] = dep.split(`?`)
      try {
        // 通过动态 import 拉取最新模块
        const newMod = await import(
          path + `?t=${timestamp}${query ? `&${query}` : ''}`
        )
        moduleMap.set(dep, newMod)
      } catch (e) {}
    }),
  )

  return () => {
    // 拉取最新模块后执行更新回调
    for (const { deps, fn } of mod.callbacks) {
      fn(deps.map((dep: any) => moduleMap.get(dep)))
    }
    console.log(`[ranite] hot updated: ${path}`)
  }
}

const sheetsMap = new Map()

export function updateStyle(id: string, content: string): void {
  let style = sheetsMap.get(id)
  if (!style) {
    // 添加 style 标签
    style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = content
    document.head.appendChild(style)
  } else {
    // 更新 style 标签内容
    style.innerHTML = content
  }
  sheetsMap.set(id, style)
}

export function removeStyle(id: string): void {
  const style = sheetsMap.get(id)
  if (style) {
    document.head.removeChild(style)
  }
  sheetsMap.delete(id)
}
