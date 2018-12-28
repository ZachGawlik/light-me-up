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

const setLed = index => {
  const square = document.querySelectorAll('.led')[index]
  if (square.style.backgroundColor !== activeColor) {
    socket.emit('colored', index, activeColor)
    square.style.backgroundColor = activeColor
  }
}

const setActiveColor = newActiveColor => {
  const colorPicker = document.body.querySelector('.color-picker')
  activeColor = newActiveColor
  colorPicker.style.borderColor = newActiveColor
}

const init = () => {
  const colorSwatches = COLORS.map(color => {
    const swatch = document.createElement('button')
    swatch.className = 'color-swatch'
    swatch.style.backgroundColor = color
    swatch.style.outlineColor = color
    swatch.dataset.color = color
    swatch.addEventListener('touchstart', e => {
      e.preventDefault() // prevent highlighting when initiating touch
      setActiveColor(color)
    })
    swatch.addEventListener('click', () => {
      setActiveColor(color)
    })
    return swatch
  })

  const colorPicker = document.body.querySelector('.color-picker')
  colorPicker.style.borderColor = activeColor
  colorPicker.append(...colorSwatches)

  const leds = [...new Array(64)].map((_, index) => {
    const square = document.createElement('div')
    square.className = 'led'

    square.addEventListener('click', () => {
      setLed(index)
    })
    square.addEventListener('touchstart', e => {
      e.preventDefault() // prevent highlighting when initiating touch
      setLed(index)
    })
    square.addEventListener('mousemove', () => {
      if (clickPressed) {
        setLed(index)
      }
    })
    return square
  })
  document.body.querySelector('.led-matrix').append(...leds)
}

document.addEventListener(
  'touchstart',
  e => {
    e.preventDefault() // prevent double-tap to zoom
  },
  {passive: false}
)

document.addEventListener(
  'touchmove',
  e => {
    e.preventDefault() // prevent pinch to zoom

    const currentTouchLocation = event.touches[0]
    const touchTarget = document.elementFromPoint(
      currentTouchLocation.clientX,
      currentTouchLocation.clientY
    )

    // touchTarget is null when dragging outside of window
    if (!touchTarget) {
      return
    }

    if (touchTarget.className === 'led') {
      const ledIndex = [...document.querySelectorAll('.led')].indexOf(
        touchTarget
      )
      setLed(ledIndex)
    } else if (touchTarget.className === 'color-swatch') {
      setActiveColor(touchTarget.dataset.color)
    }
  },
  {passive: false}
)

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

socket.on('colored', (index, color) => {
  document.body.querySelectorAll('.led')[index].style.backgroundColor = color
})

socket.on('user count', count => {
  document.querySelector('.count-text').innerHTML = `# of users: ${count}`
})

init()
