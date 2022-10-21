import Player from './classes/player'
import { MovingDirection } from './common/enum'

export default function startGame(canvas: HTMLCanvasElement): void {
  // Canvas general configuration
  canvas.width = 80 * 16 // 1280
  canvas.height = 80 * 9 // 720

  // Your context
  const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d')

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
    l: {
      pressed: false,
      hitCount: 1,
      cantHold: true,
    },
    Space: {
      pressed: false,
    },
  }

  // Hero Creation
  const player: Player = new Player({
    position: { x: 1000, y: 150 },
    context: canvasContext,
  })

  player.onAfterAttack = () => {
    keys.l.pressed = false
    console.log(keys.l.hitCount)
    if (player.isAttacking) {
      if (keys.l.hitCount >= 3) {
        keys.l.hitCount = 1
      } else {
        keys.l.hitCount++
      }
    }
  }

  // Background
  const background = new Image()
  background.src = '/assets/background.png'

  let elapsedGameFrames: number = 0
  let afterUpdateCallback: () => void = null

  function startAnimationFrame() {
    if (!canvasContext) return
    window.requestAnimationFrame(startAnimationFrame)

    // Clear canvas before add elements
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    canvasContext.drawImage(background, 0, 0, canvas.width, canvas.height)

    // Draw a semi-transparent backround for a better contrast
    canvasContext.fillStyle = 'rgb(255,255,255, .1)'
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
    } else if (keys.l.pressed) {
      player.attack(keys.l.hitCount % 3 === 0)
    }

    player.update()
    elapsedGameFrames++

    // Clear the combo after some time
    if (elapsedGameFrames % 300 === 0) {
      keys.l.hitCount = 1
    }
  }

  startAnimationFrame()

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (keys[event.key]) keys[event.key].pressed = true
    if (keys[event.code]) keys[event.code].pressed = true
  })

  window.addEventListener('keyup', (event: KeyboardEvent) => {
    if (keys[event.key]) {
      if (!keys[event.key].cantHold) {
        keys[event.key].pressed = false
      }
    }

    if (keys[event.code]) keys[event.code].pressed = false
  })
}
