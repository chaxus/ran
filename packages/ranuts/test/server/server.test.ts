import { describe, it } from 'vitest'
import Server from '@/server/server'
import bodyMiddleware from '@/server/body'
import colors from '@/colors'
import type { Context, Next } from '@/server/server'
import Router from '@/server/router'

const app = new Server()
const PORT = 30103

const router = new Router()

router.get('/api/test', (ctx, next) => {
  const { res } = ctx
  const { query } = ctx.request
  res.end(JSON.stringify(query))
})

router.post('/api/test', (ctx, next) => {
  const { res } = ctx
  const { body } = ctx.request
  res.end(JSON.stringify(body))
})

const requestMiddleWare = (ctx: Context, next: Next) => {
  const { query, method, path, body } = ctx.request
  const { res } = ctx
  if (method === 'POST') {
    // application/json
    if (path === '/api/test') {
      res.end(JSON.stringify(body))
    }
    // file
    if (path === '/api/upload') {
      res.end(JSON.stringify(body))
    }
  }
}
app.use(bodyMiddleware())

app.use(router.routes())
// app.use(requestMiddleWare)

app.listen(PORT, () => {
  console.info(
    colors.green(
      `===========================> Server Start at ${PORT} <===============================`,
    ),
  )
})
//     })
// })
