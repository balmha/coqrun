import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./update.js"

const cockElem = document.querySelector("[data-cock]")
const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const COCK_FRAME_COUNT = 2
const FRAME_TIME = 100
let gameSound = new Audio("audio/press_sound.mp3");
gameSound.volume=0.5;
let Collisionsound = new Audio("audio/hit_sound.mp3");
Collisionsound.volume = 0.5;

let isJumping
let cockFrame
let currentFrameTime
let yVelocity
export function setupCock() {
  isJumping = false
  cockFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(cockElem, "--bottom", 0)
  document.removeEventListener("keydown", onJump)
  document.addEventListener("keydown", onJump)
}

export function updateCock(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)
}

export function getCockRect() {
  return cockElem.getBoundingClientRect()
}

export function setCockLose() {
  cockElem.src = "images/cock-lose.png"
  Collisionsound.play();
  
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    cockElem.src = `images/cock-stationary.png`
    return
  }

  if (currentFrameTime >= FRAME_TIME) {
    cockFrame = (cockFrame + 1) % COCK_FRAME_COUNT
    cockElem.src = `images/cock-run-${cockFrame}.png`
    currentFrameTime -= FRAME_TIME
  }
  currentFrameTime += delta * speedScale
}

function handleJump(delta) {
  if (!isJumping) return

  incrementCustomProperty(cockElem, "--bottom", yVelocity * delta)

  if (getCustomProperty(cockElem, "--bottom") <= 0) {
    setCustomProperty(cockElem, "--bottom", 0)
    isJumping = false
  }

  yVelocity -= GRAVITY * delta
}

function onJump(e) {
  if (e.code !== "Space" || isJumping) return

  yVelocity = JUMP_SPEED
  isJumping = true
  gameSound.play()
}
