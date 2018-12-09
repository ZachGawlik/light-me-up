const express = require('express')
const path = require('path')
const http = require('http')

const app = express()
const httpServer = http.Server(app)

const DIST_DIR = path.join(__dirname, 'dist')

app.use(express.static(DIST_DIR))

app.get('/', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

httpServer.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on http://localhost:3000')
})
