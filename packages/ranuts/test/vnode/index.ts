import Application from '@/server/server'
import send from '@/server/send'

const app = new Application()

app.use(send())

app.listen(8088, () => {
    console.log(`Server port is http://localhost:8088`);
})