import Player from './classes/player'
import { MovingDirection } from './common/enum'

export default function startGame(canvas: HTMLCanvasElement): void {
  // Canvas general configuration
  canvas.width = 80 * 16 // 1280
  canvas.height = 80 * 9 // 720

  // Your context
  const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d')

  // Hero Creation
  const player: Player = new Player({
    position: { x: 100, y: 150 },
    context: canvasContext,
  })

  // Keyboard control
  const keys = {
    a: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    w: {
      pressed: false,
    },
    Space: {
      pressed: false,
    },
  }

  function startAnimationFrame() {
    if (!canvasContext) return
    window.requestAnimationFrame(startAnimationFrame)

    // Clear canvas before add elements
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    // Draw a tamporary background
    canvasContext.fillStyle = 'white'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    // The game begins here
    // - Player movement
    player.stop()
    if (keys.a.pressed) {
      player.move(MovingDirection.LEFT, keys.Space.pressed)
    } else if (keys.d.pressed) {
      player.move(MovingDirection.RIGHT, keys.Space.pressed)
    } else if (keys.w.pressed) {
      player.move(MovingDirection.TOP, keys.Space.pressed)
    } else if (keys.s.pressed) {
      player.move(MovingDirection.BOTTON, keys.Space.pressed)
    }

    player.update()
  }

  startAnimationFrame()

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (keys[event.key]) keys[event.key].pressed = true
    if (keys[event.code]) keys[event.code].pressed = true
  })

  window.addEventListener('keyup', (event: KeyboardEvent) => {
    if (keys[event.key]) keys[event.key].pressed = false
    if (keys[event.code]) keys[event.code].pressed = false
  })
}
