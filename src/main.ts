import './style.css'
import startGame from './game'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div><canvas></canvas></div>
`

startGame(document.querySelector<HTMLCanvasElement>('canvas')!)
