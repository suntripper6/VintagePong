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
let pongX = 490;
let pongY = 320;

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
  ctx.fillRect(pongX, pongY, pongWidth, pongHeight);
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
  pongX = height / 2;
  pongY = width / 2;
  pongY = -3;
  paddlePongContact = false;
};

const pongGameMovement = () => {
  pongX += -pongSpeedX;
  if (paddlePlayerLeftMove && paddlePongContact) {
    pongSpeedY += pongSpeedY;
  }
};

const gameBoundaries = () => {
  // Bounce Top Wall
  if (pongX < 0 && pongSpeedX < 0) {
    pongSpeedX = -pongSpeedX;
    console.log(`Top Wall: PongX ${pongX} ${pongSpeedX}`);
  }
  // Bounce Bottom Wall
  if (pongX > height && pongSpeedX > 0) {
    pongSpeedX = -pongSpeedX;
    console.log(`Bottom Wall: PongX ${pongX} PongX Speed: ${pongSpeedX}`);
  }
  // human paddle
  if (pongY < height + paddleMovement) {
    console.log(`Height: ${height} PongY: ${pongY}`);
    if (pongX < paddleLeftY && pongX < (paddleLeftY - paddleHeight) / 2) {
      console.log(
        `2nd if PongY: ${pongX} PaddleLeftY - PaddleHeight: ${
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
      vector = pongX - (paddleLeftY + paddleMovement);
      pongSpeedX = vector * 0.3;
    } else if (pongY > width) {
      console.log(`PongY: ${pongY} Width: ${width}`);
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
    if (paddleRightY - paddleMovement > pongX) {
      console.log(
        `HumanMove: ${paddlePlayerLeftMove} paddleMovement: ${paddleMovement} PongX: ${pongX}`
      );
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
startGame();
