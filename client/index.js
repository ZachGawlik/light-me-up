import io from 'socket.io-client'
import './base.scss'
import './led.scss'

const COLORS = [
  'rgb(255,179,186)',
  'rgb(255,223,186)',
  'rgb(255,255,186)',
  'rgb(186,255,201)',
  'rgb(186,225,255)',
  'rgb(0,0,0)',
]

const socket = io()

const isLeftMouseButton = mouseEvent => mouseEvent.button === 0

let leftClickPressed = false
let activeColor = COLORS[0]

const init = () => {
  document.querySelectorAll('button.color-swatch').forEach((b, index) => {
    const color = COLORS[index]
    b.dataset.color = color
    b.style.backgroundColor = color
    b.style.outlineColor = color
    b.addEventListener('click', () => {
      activeColor = color
    })
  })

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

socket.on('colored', (count, color) => {
  document.body.querySelectorAll('.led')[count].style.backgroundColor = color
})

socket.on('user count', count => {
  document.querySelector('.user-count').innerHTML = count - 1
})

init()
