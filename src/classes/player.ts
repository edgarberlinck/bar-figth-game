import { GRAVITY } from '../common/constants'
import { MovingDirection, PlayerState } from '../common/enum'
import { ScreenElement, Sprite } from '../common/interfaces'
import { MovingSpeed, Position, Size } from '../common/types'

const PLAYER_SPEED_WALKING = 1
const PLAYER_SPEED_RUNNING = 3
const PLAYER_DEFAULT_SIZE: Size = { width: 150, heigth: 150 }
const PLAYER_SPRITE_DIMENSIONS: Size = {
  width: 126,
  heigth: 110,
}
export default class Player implements ScreenElement {
  public position: Position
  public size: Size
  public context: CanvasRenderingContext2D
  public movingSpeed: MovingSpeed

  // Player sprites
  public idleLeft: Sprite
  public idleRight: Sprite
  public walkingLeft: Sprite
  public walkingRight: Sprite
  public runningLeft: Sprite
  public runningRight: Sprite

  // Animation utils
  public currentFrame: number = 0
  public elapsedFrames: number = 0
  public currentDirection: MovingDirection = MovingDirection.LEFT
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
    // - Idle
    this.idleLeft = {
      image: new Image(),
      numberOfFrames: 3,
    }
    this.idleLeft.image.src = '/public/assets/jack/Idle-left.png'

    this.idleRight = {
      image: new Image(),
      numberOfFrames: 3,
    }
    this.idleRight.image.src = '/public/assets/jack/Idle-right.png'
    // ------------------

    // - walking
    this.walkingLeft = {
      image: new Image(),
      numberOfFrames: 3,
    }
    this.walkingLeft.image.src = '/public/assets/jack/walking-left.png'

    this.walkingRight = {
      image: new Image(),
      numberOfFrames: 3,
    }
    this.walkingRight.image.src = '/public/assets/jack/walking-right.png' // TODO: Fix the walking right sprite, doesn't not looks like he is walking at all
    // ------------------
    this.runningLeft = {
      image: new Image(),
      numberOfFrames: 3,
    }
    this.runningLeft.image.src = '/public/assets/jack/walking-left.png' //TODO: I need to do a running sprite later

    this.runningRight = {
      image: new Image(),
      numberOfFrames: 3,
    }
    this.runningRight.image.src = '/public/assets/jack/walking-right.png' //TODO: I need to do a running sprite later

    this.state = PlayerState.HOLD
    this.imageToDraw = this.hold
  }

  stop() {
    this.movingSpeed = { x: 0, y: 0 }
    this.state = PlayerState.HOLD
  }

  move(direction: MovingDirection, running: boolean = false) {
    this.state = running ? PlayerState.RUNNING : PlayerState.WALKING
    this.currentDirection = direction
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
        return this.currentDirection === MovingDirection.LEFT
          ? this.idleLeft
          : this.idleRight
      case PlayerState.WALKING:
        return this.currentDirection === MovingDirection.RIGHT
          ? this.walkingRight
          : this.walkingLeft
      case PlayerState.RUNNING:
        return this.currentDirection === MovingDirection.RIGHT
          ? this.runningRight
          : this.runningLeft
      default:
        return this.this.idleLeft
    }
  }

  update() {
    this.position.x += this.movingSpeed.x
    this.position.y += this.movingSpeed.y

    this.imageToDraw = this.currentStateSprite()

    this.elapsedFrames++
    if (this.elapsedFrames % 20 === 0) {
      if (this.currentFrame >= this.imageToDraw.numberOfFrames - 1) {
        this.currentFrame = 0
      } else {
        this.currentFrame++
      }
    }
    this.draw()
  }

  draw() {
    this.context.drawImage(
      this.imageToDraw.image,
      PLAYER_SPRITE_DIMENSIONS.width * this.currentFrame,
      0,
      PLAYER_SPRITE_DIMENSIONS.width,
      PLAYER_SPRITE_DIMENSIONS.heigth,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.heigth
    )
  }
}
