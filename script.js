import { updateGround, setupGround } from "./ground.js"
import { updateclouds, setupclouds } from "./clouds.js"
import { updateCock, setupCock, getCockRect, setCockLose } from "./cock.js"
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js"
import {cleantable, getScore, isConnected} from "./walletconnect.js"

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")
const jumpScreenElem = document.querySelector("[data-jump-screen]")
const connectScreenElem = document.querySelector("[data-connect-screen]")
const connectScreenButton = document.getElementById('ConnectMet');
const connectedScreenButton = document.getElementById('ConnectedWallet');
const scoreScreenButton = document.querySelector('[data-score-screen]');


setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
window.addEventListener("load", handleConnect, { once: true })

let lastTime
let speedScale
let score

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
  cleantable();
  lastTime = null
  speedScale = 1
  score = 0
  setupclouds()
  setupGround()
  setupCock()
  setupCactus()
  scoreScreenButton.classList.add("hide");
  startScreenElem.classList.add("hide");
  jumpScreenElem.classList.add("hide");
  window.requestAnimationFrame(update)
}

async function handleConnect() {
  lastTime = null
  speedScale = 1
  score = 0
  setupclouds()
  setupGround()
  setupCock()
  setupCactus()
  if (await isConnected()){
    connectScreenButton.classList.add("hide")
    connectScreenElem.classList.add("hide")
    startScreenElem.classList.remove("hide")
    connectedScreenButton.classList.remove("hide")
    jumpScreenElem.classList.remove("hide")
    document.addEventListener("keypress", handleStart, { once: true })
  }
  else {
    startScreenElem.classList.add("hide")
    connectedScreenButton.classList.add("hide")
    jumpScreenElem.classList.add("hide");
    connectScreenElem.classList.remove("hide")
    connectScreenButton.classList.remove("hide")
  }
}

async function handleLose() {
  setCockLose()
  await getScore(score);
  setTimeout(() => {
    scoreScreenButton.classList.remove("hide");
    startScreenElem.classList.remove("hide");
    jumpScreenElem.classList.remove("hide");
    document.addEventListener("keydown", handleStart, { once: true })
  }, 0)
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