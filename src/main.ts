import './style.css'
import startGame from './game'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<button id='song'>click</button> <audio></audio>
  <div><canvas></canvas></div>`

startGame(document.querySelector<HTMLCanvasElement>('canvas')!)
