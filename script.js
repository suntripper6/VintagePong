// *** VARIABLES
const body = document.querySelector("body");
const windowScreenHeight = window.screen.height;

// Create Headder
const header = document.createElement("header");
const heading = document.createElement("h1");
heading.id = "greeting";
heading.innerText = "Shall we play a game?";
// body.appendChild(header).appendChild(heading);

//Create Buttons

// Appeding created elements

// Canvas & context
const width = 1000;
const height = 700;
const canvasPos = windowScreenHeight / 4 - height / 3;
console.log(canvasPos);
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// Center line
const centerLineWidth = 20;
const centerLineHeight = 700;

// Pong
const pongWidth = 20;
const pongHeight = 20;
let pongX = 490;
let pongY = 320;

// Pong Speed
let pongSpeedX = 1;
let pongSpeedY = 1;
let computerSpeed = 3;
let movementY = 0;

// Paddle
const paddleWidth = 25;
const paddleHeight = 150;
let paddleLeftY = 250;
let paddleRightY = 250;
let paddlePongContact = true;

// Paddle Movement
let paddlePlayerLeftMove = false;
let paddleMovement = 24; // controls smoothness of movements

// Score & etc.
let scorePlayerLeft = 0;
let scorePlayerRight = 0;
let isGameOver = false;
let winner;

// *** FUNCTIONS

const pongPosReset = () => {
  // set to random position on the divider.
};

const renderGameBoard = () => {
  // Render Canvas
  ctx.fillStyle = "#4194FA";
  ctx.fillRect(0, 0, width, height);

  // Center Line
  ctx.fillStyle = "#DDDDDD";
  ctx.fillRect(490, 0, centerLineWidth, centerLineHeight);

  // Render Pong
  ctx.fillStyle = "#000000";
  ctx.fillRect(pongX, pongY, pongWidth, pongHeight);

  // Render Paddles
  ctx.fillStyle = "#DDDDDD";
  // Paddle Left
  ctx.fillRect(40, paddleLeftY, paddleWidth, paddleHeight);
  // Paddle Right
  ctx.fillRect(935, paddleRightY, paddleWidth, paddleHeight);

  // Render Score
  // ctx.font = "64px Press Start 2P";
  ctx.font = "64px monospace";
  ctx.fillText(scorePlayerLeft, 425, canvas.height / 14 + 20);
  ctx.fillText(scorePlayerRight, 535, canvas.height / 14 + 20);
};

const renderGameCanvas = () => {
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);
  renderGameBoard();
};

// document.fonts.ready.then(() => {
//   renderGameCanvas();
// });

const pongMovement = () => {
  pongX += -pongSpeedX;
};

const pongBoundary = () => {};

//paddleRightY
const computerPlayerAI = () => {};

const gameState = () => {
  renderGameCanvas();
  pongMovement();
  pongBoundary();
  computerPlayerAI();
  window.requestAnimationFrame(gameState); //https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
};

const startGamePlay = () => {
  scorePlayerLeft = 0;
  scorePlayerRight = 0;
  renderGameCanvas();
  gameState();

  canvas.addEventListener("mousemove", (event) => {
    paddlePlayerLeftMove = true;
    paddleLeftY = event.clientY - canvasPos + paddleMovement;
    if (paddleLeftY < paddleMovement) {
      paddleLeftY = 0;
    }
    if (paddleLeftY > height - paddleHeight) {
      paddleLeftY = height - paddleHeight;
    }

    //canvas.style.cursor = "none";
  });
};

// *** EVENT LISTENERS
// Mouse

// Start Pong
startGamePlay();
