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
}
