import io from 'socket.io-client'
import './base.scss'
import './led.scss'

const COLORS = [
  'rgb(255,0,0)',
  'rgb(255,165,0)',
  'rgb(255,255,0)',
  'rgb(128,128,0)',
  'rgb(255,20,147)',
  'rgb(128,0,0)',
  'rgb(0,255,0)',
  'rgb(0,128,0)',
  'rgb(0,255,255)',
  'rgb(0,128,128)',
  'rgb(0,0,255)',
  'rgb(0,0,128)',
  'rgb(255,0,255)',
  'rgb(128,0,128)',
  'rgb(80,80,80)',
  'rgb(0,0,0)',
]

const socket = io()

const isLeftMouseButton = mouseEvent => mouseEvent.button === 0

let leftClickPressed = false
let activeColor = COLORS[0]

const init = () => {
  const colorSwatches = COLORS.map(color => {
    const swatch = document.createElement('button')
    swatch.className = 'color-swatch'
    swatch.style.backgroundColor = color
    swatch.style.outlineColor = color
    swatch.addEventListener('click', () => {
      activeColor = color
    })
    return swatch
  })
  document.body.querySelector('.color-swatches').append(...colorSwatches)

  const leds = [...new Array(64)].map((_, index) => {
    const square = document.createElement('div')
    square.className = 'led'
    square.addEventListener('click', event => {
      if (isLeftMouseButton(event)) {
        socket.emit('colored', index, activeColor)
        square.style.backgroundColor = activeColor
      }
    })
    square.addEventListener('mousemove', () => {
      if (leftClickPressed) {
        socket.emit('colored', index, activeColor)
        square.style.backgroundColor = activeColor
      }
    })
    return square
  })
  document.body.querySelector('.led-matrix').append(...leds)
}

window.addEventListener('mousedown', event => {
  if (isLeftMouseButton(event)) {
    leftClickPressed = true
  }
})
window.addEventListener('mouseup', event => {
  if (isLeftMouseButton(event)) {
    leftClickPressed = false
  }
})

socket.on('initialize', board => {
  document.querySelectorAll('.led').forEach((square, index) => {
    square.style.backgroundColor = board[index]
  })
})

socket.on('colored', (count, color) => {
  document.body.querySelectorAll('.led')[count].style.backgroundColor = color
})

socket.on('user count', count => {
  document.querySelector(
    '.count-text'
  ).innerHTML = `Current # of users: ${count}`
})

init()
