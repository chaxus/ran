import { describe, it } from 'vitest'
import Server from '@/server/server'
import bodyMiddleware from '@/server/body'
import colors from '@/colors'
import type { Context, Next } from '@/server/server'

const app = new Server()
const PORT = 30103

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

app.use(requestMiddleWare)

app.listen(PORT, () => {
    console.info(
        colors.green(
            `===========================> Server Start at ${PORT} <===============================`,
        ),
    )
})
//     })
// })