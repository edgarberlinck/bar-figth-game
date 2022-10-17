import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  it,
  should,
  vi,
} from 'vitest'
import { MovingDirection, PlayerState } from '../common/enum'
import { Position } from '../common/types'
import Player from './player'

const fakeContext = {
  canvas: {
    with: 100,
    heigth: 100,
  },
}
const fakePosition: Position = { x: 0, y: 0 }
let player: Player

vi.stubGlobal(
  'Image',
  vi.fn().mockReturnValue({
    with: 100,
    height: 100,
  })
)

describe('player', () => {
  describe('state', () => {
    beforeEach(() => {
      vi.resetAllMocks()
      player = new Player({ position: fakePosition, context: fakeContext })
    })
    it('should start idle', () => {
      expect(player.state).toBe(PlayerState.HOLD)
    })

    it('should walk when we call `move` function', () => {
      player.move(MovingDirection.RIGHT)
      expect(player.state).toBe(PlayerState.WALKING)
      player.stop()
      player.move(MovingDirection.TOP)
      expect(player.state).toBe(PlayerState.WALKING)
      player.stop()
      player.move(MovingDirection.BOTTON)
      expect(player.state).toBe(PlayerState.WALKING)
      player.stop()
      player.move(MovingDirection.LEFT)
      expect(player.state).toBe(PlayerState.WALKING)
    })

    it('should run when we call `move` with `running` equal to `true`', () => {
      player.move(MovingDirection.RIGHT, true)
      expect(player.state).toBe(PlayerState.RUNNING)
      player.stop()
      player.move(MovingDirection.TOP, true)
      expect(player.state).toBe(PlayerState.RUNNING)
      player.stop()
      player.move(MovingDirection.BOTTON, true)
      expect(player.state).toBe(PlayerState.RUNNING)
      player.stop()
      player.move(MovingDirection.LEFT, true)
      expect(player.state).toBe(PlayerState.RUNNING)
    })
  })

  describe('moving direction', () => {
    beforeEach(() => {
      vi.resetAllMocks()
      player = new Player({ position: fakePosition, context: fakeContext })
    })
    it('should update the direction when move to left/right', () => {
      expect(player.currentDirection).toBe(MovingDirection.LEFT)
      player.move(MovingDirection.RIGHT, false)
      expect(player.currentDirection).toBe(MovingDirection.RIGHT)
      player.move(MovingDirection.LEFT, false)
      expect(player.currentDirection).toBe(MovingDirection.LEFT)
    })

    it('should not update the direction when move to top/botton', () => {
      player.move(MovingDirection.RIGHT, false)
      player.move(MovingDirection.TOP, false)
      expect(player.currentDirection).toBe(MovingDirection.RIGHT)
      player.move(MovingDirection.BOTTON, false)
      expect(player.currentDirection).toBe(MovingDirection.RIGHT)
    })
  })

  describe('boundaries', () => {
    beforeEach(() => {
      vi.resetAllMocks()
      player = new Player({ position: fakePosition, context: fakeContext })
      vi.spyOn(player, 'draw').mockReturnThis()
    })
    it('should not be possible get await from screen', () => {
      player.move(MovingDirection.TOP)
      player.update()
      expect(player.position.y).toBe(0)
    })
  })
})
