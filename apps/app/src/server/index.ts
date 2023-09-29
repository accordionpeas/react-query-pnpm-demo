import path from 'path'
import fs from 'fs'
import http from 'http'
import express from 'express'
import controller from './controller'

const app = express()
const server = http.createServer(app)

app
  .get('*.js', (req, res) => {
    const filePath = path.join(process.cwd(), 'build/public', req.url)

    const stream = fs.createReadStream(filePath)

    res.set('Content-Type', 'text/javascript')

    stream.pipe(res)
  })
  .get('/', controller)

const port = 4321

server.listen(port, () => {
  console.log(`Ready on ${port}`)
})
