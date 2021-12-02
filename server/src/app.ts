import { Server } from "socket.io"
import http from "http"

const server = http.createServer()
const url = process.argv[2]
const port = parseInt(process.argv[3])
server.listen(port, url)
console.log('Running on: ' + url)

const io = new Server({
  cors: {
    origin: '*'
  }
})

io.on('connection', client => {
  console.log('user connected', client.id)

  client.on('disconnect', () => {
    console.log('user disconnected: ' + client.id)
  })

  client.on('sync_req', interval => {
    const response = {
      date: Date.now(),
      interval
    }
    io.sockets.emit('sync', response)
  })
})

io.listen(server)
