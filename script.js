// *** VARIABLES
const { body } = document;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const width = 1000;
const height = 700;
const windowScreenHeight = window.screen.height;
const canvasPos = windowScreenHeight / 4 - height / 4;

// Appending created elements
// Create Header
// const header = document.createElement("header");
// const heading = document.createElement("h1");
// heading.id = "greeting";
// heading.innerText = "Shall we play a game?";
// body
//   .appendChild(header)
//   .appendChild(heading)
//   .insertBefore(canvas, body.childNodes[3]);

//Create Buttons

// Canvas & context

// Center line
const centerLineWidth = 20;
const centerLineHeight = 700;

// Pong
const pongWidth = 20;
const pongHeight = 20;
let pongPosX = 490;
let pongPosY = 320;

// Pong Speed
let pongSpeedX = 1;
let pongSpeedY = 1;
let computerSpeed = 1;
let movementY = 0;
let vector;

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

const renderGameBoard = () => {
  // Render Canvas
  ctx.fillStyle = "#4194FA";
  ctx.fillRect(0, 0, width, height);

  // Center Line
  ctx.fillStyle = "#DDDDDD";
  ctx.fillRect(490, 0, centerLineWidth, centerLineHeight);

  // Render Pong
  ctx.beginPath();
  ctx.fillStyle = "#dddddd";
  ctx.fillRect(pongPosX, pongPosY, pongWidth, pongHeight);
  ctx.fill();

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

//renderGameCanvas();

// document.fonts.ready.then(() => {
//   renderGameCanvas();
// });

const pongReset = () => {
  // set to random position on the divider.
  //const randDenom = Math.floor(Math.random() * 10) + 1;
  pongPosX = height / 2;
  pongPosY = width / 2;
  pongPosY = -3;
  paddlePongContact = false;
};

const pongGameMovement = () => {
  pongPosX += -pongSpeedX;
  if (paddlePlayerLeftMove && paddlePongContact) {
    pongSpeedY += pongSpeedY;
  }
};

const gameBoundaries = () => {
  // Bounce Top Wall
  if (pongPosX < 0 && pongSpeedX < 0) {
    pongSpeedX = -pongSpeedX;
    console.log(`Top Wall: pongPosX ${pongPosX} PongSpeedX: ${pongSpeedX}`);
  }
  // Bounce Bottom Wall
  if (pongPosX > height && pongSpeedX > 0) {
    pongSpeedX = -pongSpeedX;
    console.log(`Bottom Wall: pongPosX ${pongPosX} PongSpeedX: ${pongSpeedX}`);
  }
  // human paddle
  if (pongPosY < height + paddleMovement) {
    console.log(`Height: ${height} pongPosY: ${pongPosY}`);
    if (pongPosX < paddleLeftY && pongPosX < (paddleLeftY - paddleHeight) / 2) {
      console.log(
        `pongPosX: ${pongPosX} paddleLeftY: ${paddleLeftY} paddleLeftY - paddleheight / 2: ${
          paddleLeftY - paddleHeight
        }`
      );
      paddlePongContact = true;
      if (paddlePlayerLeftMove) {
        pongSpeedY -= 1;
        if (pongSpeedY < -5) {
          pongSpeedY = -5;
          computerSpeed = 6;
        }
      }
      // Pong Volley
      pongSpeedY = -pongSpeedY;
      vector = pongPosX - (paddleLeftY + paddleMovement);
      pongSpeedX = vector * 0.3;
    } else if (pongPosY > width) {
      console.log(`pongPosY: ${pongPosY} Width: ${width}`);
      scorePlayerRight++;
      pongReset();
    }
  }
  // COMPUTER PLAYER HERE
};

//paddleRightY
const computerPlayerAI = () => {
  // redefine computerSpeed depeding on button clicked
  if (paddlePlayerLeftMove) {
    if (paddleRightY + paddleMovement < pongPosX) {
      paddleRightY += computerSpeed;
    } else {
      paddleRightY -= computerSpeed;
    }
  }
};

const renderGameState = () => {
  renderGameCanvas();
  pongGameMovement();
  gameBoundaries();
  computerPlayerAI();
  window.requestAnimationFrame(renderGameState); //https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
};

const startGame = () => {
  scorePlayerLeft = 0;
  scorePlayerRight = 0;
  //pongReset();
  renderGameCanvas();
  renderGameState();

  canvas.addEventListener("mousemove", (event) => {
    paddlePlayerLeftMove = true;
    paddleLeftY = event.clientY - canvasPos + paddleMovement;
    console.log(`paddleLeftY: ${paddleLeftY}`);

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
//btnEasy.addEventListener("click", easyMode);
//btnEasy.addEventListener("click", mediumMode);
//btnEasy.addEventListener("click", hardMode);

// Mouse

// Start Pong
startGame();
