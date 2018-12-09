const express = require('express')
const path = require('path')

const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

let userCount = 0
io.on('connection', function(socket) {
  userCount += 1
  io.emit('user count', userCount)
  socket.on('disconnect', function() {
    userCount -= 1
    io.emit('user count', userCount)
  })

  socket.on('colored', (index, color) => {
    socket.broadcast.emit('colored', index, color)
  })
})

const DIST_DIR = path.join(__dirname, 'dist')
app.use(express.static(DIST_DIR))
app.get('/', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

http.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on http://localhost:3000')
})
