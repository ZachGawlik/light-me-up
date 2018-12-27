import io from 'socket.io-client'
import './base.scss'
import './led.scss'

const COLORS = [
  'rgb(255, 0, 0)',
  'rgb(255, 140, 0)',
  'rgb(255, 255, 0)',
  'rgb(255, 20, 147)',
  'rgb(128, 128, 0)',
  'rgb(128, 0, 0)',
  'rgb(0, 255, 0)',
  'rgb(0, 128, 0)',
  'rgb(0, 255, 255)',
  'rgb(0, 128, 128)',
  'rgb(0, 0, 255)',
  'rgb(0, 0, 128)',
  'rgb(255, 0, 255)',
  'rgb(128, 0, 128)',
  'rgb(80, 80, 80)',
  'rgb(0, 0, 0)',
]

const socket = io()

let clickPressed = false
let activeColor = COLORS[0]

const init = () => {
  const colorPicker = document.body.querySelector('.color-picker')
  const colorSwatches = COLORS.map(color => {
    const swatch = document.createElement('button')
    swatch.className = 'color-swatch'
    swatch.style.backgroundColor = color
    swatch.style.outlineColor = color
    swatch.addEventListener('click', () => {
      activeColor = color
      colorPicker.style.borderColor = activeColor
    })
    return swatch
  })

  colorPicker.style.borderColor = activeColor
  colorPicker.append(...colorSwatches)

  const leds = [...new Array(64)].map((_, index) => {
    const square = document.createElement('div')

    const setColor = (index, activeColor) => {
      if (square.style.backgroundColor !== activeColor) {
        socket.emit('colored', index, activeColor)
        square.style.backgroundColor = activeColor
      }
    }

    square.className = 'led'
    square.addEventListener('click', () => {
      setColor(index, activeColor)
    })
    square.addEventListener('touchmove', () => {
      setColor(index, activeColor)
    })
    square.addEventListener('mousemove', () => {
      if (clickPressed) {
        setColor(index, activeColor)
      }
    })
    return square
  })
  document.body.querySelector('.led-matrix').append(...leds)
}

window.addEventListener('mousedown', () => {
  clickPressed = true
})
window.addEventListener('mouseup', () => {
  clickPressed = false
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
  document.querySelector('.count-text').innerHTML = `# of users: ${count}`
})

init()
