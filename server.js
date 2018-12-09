const express = require('express')
const path = require('path')

const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

let state = {
  userCount: 0,
  board: Array(64).fill('rgb(0,0,0)'),
}

io.on('connection', function(socket) {
  state.userCount += 1
  io.emit('user count', state.userCount)
  socket.emit('initialize', state.board)

  socket.on('disconnect', function() {
    state.userCount -= 1
    io.emit('user count', state.userCount)
  })

  socket.on('colored', (index, color) => {
    socket.broadcast.emit('colored', index, color)
    state.board[index] = color
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
