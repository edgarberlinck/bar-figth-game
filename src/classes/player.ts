import { GRAVITY } from '../common/constants'
import { MovingDirection, PlayerState } from '../common/enum'
import { ScreenElement, Sprite } from '../common/interfaces'
import { MovingSpeed, Position, Size } from '../common/types'

const PLAYER_SPEED_WALKING = 1
const PLAYER_SPEED_RUNNING = 3
const PLAYER_DEFAULT_SIZE: Size = { width: 200, heigth: 150 }
const MAX_SPRITES_PER_LINE = 7
const PLAYER_SPRITE_DIMENSIONS: Size = {
  width: 56,
  heigth: 56,
}

const PLAYER_SPRITES = [
  '/public/assets/player/char_blue_1.png',
  '/public/assets/player/char_blue_2.png',
]

export default class Player implements ScreenElement {
  public position: Position
  public size: Size
  public context: CanvasRenderingContext2D
  public movingSpeed: MovingSpeed

  // Player sprites
  public hold: Sprite
  public walking: Sprite
  public running: Sprite

  // Animation utils
  public currentFrame: number = 0
  public elapsedFrames: number = 0
  public overlayFrames: number = 0
  public imageToDraw: Sprite
  // Player state
  public state: PlayerState

  constructor({
    context,
    position,
  }: {
    context: CanvasRenderingContext2D
    position: Position
  }) {
    this.context = context
    this.position = position
    this.size = PLAYER_DEFAULT_SIZE
    this.movingSpeed = { x: 0, y: 0 }

    this.hold = {
      image: new Image(),
      numberOfFrames: 5,
      start: 0,
      startOverlay: 0,
    }
    this.hold.image.src = PLAYER_SPRITES[0]

    this.walking = {
      image: new Image(),
      numberOfFrames: 9,
      start: 0,
      startOverlay: 0,
    }
    this.walking.image.src = PLAYER_SPRITES[1]

    this.running = {
      image: new Image(),
      numberOfFrames: 7,
      start: PLAYER_SPRITE_DIMENSIONS.width * 2,
      startOverlay: 0,
    }
    this.running.image.src = PLAYER_SPRITES[0]

    this.state = PlayerState.HOLD
    this.imageToDraw = this.hold
  }

  stop() {
    this.movingSpeed = { x: 0, y: 0 }
    this.state = PlayerState.HOLD
  }

  move(direction: MovingDirection, running: boolean = false) {
    this.state = running ? PlayerState.RUNNING : PlayerState.WALKING
    const speed = running ? PLAYER_SPEED_RUNNING : PLAYER_SPEED_WALKING
    switch (direction) {
      case MovingDirection.LEFT:
        if (this.position.x > 0) {
          this.movingSpeed.x -= speed
        }
        break
      case MovingDirection.RIGHT:
        if (this.position.x + this.size.width < this.context.canvas.width) {
          this.movingSpeed.x += speed
        }
        break
      case MovingDirection.TOP:
        if (this.position.y > 0) {
          this.movingSpeed.y -= speed
        }
        break
      case MovingDirection.BOTTON:
        if (this.position.y + this.size.heigth < this.context.canvas.height) {
          this.movingSpeed.y += speed
        }
        break
    }
  }

  currentStateSprite() {
    switch (this.state) {
      case PlayerState.HOLD:
        return this.hold
      case PlayerState.WALKING:
        return this.walking
      case PlayerState.RUNNING:
        return this.running
      default:
        return this.hold
    }
  }

  update() {
    this.draw()
    this.position.x += this.movingSpeed.x
    this.position.y += this.movingSpeed.y

    this.imageToDraw = this.currentStateSprite()

    this.elapsedFrames++
    if (this.elapsedFrames % 12 === 0) {
      if (this.currentFrame >= this.imageToDraw.numberOfFrames) {
        this.currentFrame = 0
        this.overlayFrames = 0
        this.imageToDraw.startOverlay = this.imageToDraw.start
      } else {
        this.currentFrame++
        if (this.currentFrame >= MAX_SPRITES_PER_LINE) {
          this.imageToDraw.startOverlay =
            PLAYER_SPRITE_DIMENSIONS.width + this.imageToDraw.start
          if (
            this.overlayFrames <
            this.imageToDraw.numberOfFrames - MAX_SPRITES_PER_LINE - 1
          ) {
            this.overlayFrames++
          } else {
            this.overlayFrames = 0
          }
        }
      }
    }
  }

  draw() {
    let frame = this.currentFrame
    if (frame >= MAX_SPRITES_PER_LINE) {
      frame = this.overlayFrames
    }
    this.context.drawImage(
      this.imageToDraw.image,
      PLAYER_SPRITE_DIMENSIONS.width * frame,
      this.imageToDraw.startOverlay,
      PLAYER_SPRITE_DIMENSIONS.width,
      PLAYER_SPRITE_DIMENSIONS.heigth,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.heigth
    )
  }
}
