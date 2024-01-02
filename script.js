import { updateGround, setupGround } from "./ground.js"
import { updateclouds, setupclouds } from "./clouds.js"
import { updateCock, setupCock, getCockRect, setCockLose } from "./cock.js"
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js"

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")
const stopScreenElem = document.querySelector("[data-end-screen]")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })

let lastTime
let speedScale
let score
let Highscore
function update(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
    return
  }
  const delta = time - lastTime

  updateclouds(delta, speedScale)
  updateGround(delta, speedScale)
  updateCock(delta, speedScale)
  updateCactus(delta, speedScale)
  updateSpeedScale(delta)
  updateScore(delta)
  if (checkLose()) return handleLose()

  lastTime = time
  window.requestAnimationFrame(update)
}

function checkLose() {
  const cockRect = getCockRect()
  return getCactusRects().some(rect => isCollision(rect, cockRect))
}


function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
  score += delta * 0.01
  scoreElem.textContent = Math.floor(score)
}


function handleStart() {
  lastTime = null
  speedScale = 1
  score = 0
  Highscore = 1000
  setupclouds()
  setupGround()
  setupCock()
  setupCactus()
  startScreenElem.classList.add("hide")
  window.requestAnimationFrame(update)
}

function handleLose() {
  setCockLose()
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true })
    startScreenElem.classList.remove("hide")
  }, 100)
}

if (score > Highscore) {
  Highscore = score;
}

function setPixelToWorldScale() {
  let worldToPixelScale
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}
