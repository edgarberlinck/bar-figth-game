import { MovingSpeed, Position, Size } from './types'

export interface Drawable {
  context: CanvasRenderingContext2D
}

export interface ScreenElement extends Drawable {
  position: Position
  size: Size
  movingSpeed: MovingSpeed
  update: () => void
}

export interface Sprite {
  image: HTMLImageElement
  numberOfFrames: number
  start: number // refers to y axix of sprite, should not be modified
  startOverlay: number // when the sprite has more then 8 images, use this to move the y axix
}
