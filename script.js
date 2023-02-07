// *** VARIABLES
const { body } = document;

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const gameBoardWidth = canvas.width;
const gameBoardHeight = canvas.height;
const windowScreenHeight = window.screen.height;
const canvasPos = windowScreenHeight / 2 - canvas.height / 2;

const scoreText = document.querySelector("#score");
const btnEasy = document.querySelector("#easy");
const btnMedium = document.querySelector("#medium");
const btnHard = document.querySelector("#hard");
const btnStop = document.querySelector("#stop");

// Center line
const centerLineWidth = 20;
const centerLineHeight = 700;

// Score & etc.
let computerSpeed = 1;
let humanScore = 0;
let computerScore = 0;
let isGameOver = false;
let winner;
let intervalID;

// Pong
const pongRadius = 12.5;
let pongSpeedX = 1;
let pongSpeedY = 1;
let pongSpeed = 1;
let pongX = gameBoardWidth / 2;
let pongY = gameBoardHeight / 2;
let pongXTrajectory = 0;
let pongYTrajectory = 0;

// Paddle
let paddlePongContact = true;
let paddleSpeed = 50;
let humanPaddleMove = false;

let humanPaddle = {
  x: 0,
  y: 0,
  width: 20,
  height: 150,
  color: "#dddddd",
};

let computerPaddle = {
  x: gameBoardWidth - 20,
  y: gameBoardHeight - 150,
  width: 20,
  height: 150,
  color: "#dddddd",
};

// *** FUNCTIONS

const renderGameBoard = () => {
  // Render Canvas
  ctx.fillStyle = "#4194FA";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Center Line
  ctx.fillStyle = "#DDDDDD";
  ctx.fillRect(490, 0, centerLineWidth, centerLineHeight);

  // Render Score
  // ctx.font = "64px Press Start 2P";
  ctx.font = "64px monospace";
  ctx.fillText(humanScore, 425, canvas.height / 14 + 20);
  ctx.fillText(computerScore, 535, canvas.height / 14 + 20);
};

// const renderGameCanvas = () => {
//   //body.appendChild(canvas);
//   renderGameBoard();
// };

const createPaddles = () => {
  // Render Paddles
  // human paddle left
  ctx.fillStyle = humanPaddle.color;
  ctx.fillRect(
    humanPaddle.x,
    humanPaddle.y,
    humanPaddle.width,
    humanPaddle.height
  );
  ctx.strokeRect(
    humanPaddle.x,
    humanPaddle.y,
    humanPaddle.width,
    humanPaddle.height
  );

  // computer paddle right
  ctx.fillStyle = computerPaddle.color;
  ctx.fillRect(
    computerPaddle.x,
    computerPaddle.y,
    computerPaddle.width,
    computerPaddle.height
  );
  ctx.strokeRect(
    computerPaddle.x,
    computerPaddle.y,
    computerPaddle.width,
    computerPaddle.height
  );
};

const pongCreation = (pongX, pongY) => {
  // Render Pong
  // ctx.fillStyle = "#dddddd";
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(pongX, pongY, pongRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
};

const pongReset = () => {
  // set to random position on the divider.
  //const randDenom = Math.floor(Math.random() * 10) + 1;
  pongX = gameBoardWidth / 2;
  pongY = gameBoardHeight / 2;
  //paddlePongContact = false;
};

const pongMove = () => {
  pongX += pongSpeed * pongXTrajectory;
  pongY += pongSpeed * pongYTrajectory;

  console.log(`pongX: ${pongX} pongY: ${pongY}`);
};

const pongCreateRandomMovement = () => {
  pongSpeed = 1;
  // Horizontal
  if (Math.round(Math.random()) === 1) {
    pongXTrajectory = 1;
  } else {
    pongXTrajectory = -1;
  }
  console.log(`pongXTraj: ${pongXTrajectory}`);
  // Vertical
  if (Math.round(Math.random()) === 1) {
    pongYTrajectory = 1;
  } else {
    pongYTrajectory = -1;
  }
  pongReset();
  pongCreation(pongX, pongY);
};

const gameBoundaries = () => {
  // Top boundary
  if (pongY <= 0 + pongRadius) {
    pongYTrajectory *= -1;
  }
  // Bottom boundary
  if (pongY >= gameBoardHeight - pongRadius) {
    pongYTrajectory *= -1;
  }
  // Paddle hits
  // human paddle contact
  if (pongX <= humanPaddle.x + humanPaddle.width + pongRadius) {
    if (pongY > humanPaddle.y && pongY < humanPaddle.y + humanPaddle.height) {
      pongX = humanPaddle.x + humanPaddle.width + pongRadius;
      pongXTrajectory *= -1;
      pongSpeed += 1;
    }
  }

  // computer paddle contact
  if (pongX >= computerPaddle.x - pongRadius) {
    if (
      pongY > computerPaddle.y &&
      pongY < computerPaddle.y + computerPaddle.height
    ) {
      pongX = computerPaddle.x - pongRadius;
      pongXTrajectory *= -1;
      pongSpeed += 1;
    }
  }
};

// computerPaddle
const computerPlayerAI = () => {
  // redefine computerSpeed depeding on button clicked
  // if (humanPaddleMove) {
  //   if (computerPaddle.y + pongRadius < pongX) {
  //     computerPaddle.y += computerSpeed;
  //   } else {
  //     computerPaddle.y -= computerSpeed;
  //   }
  // }
};

const renderGameState = () => {
  renderGameBoard();
  createPaddles();
  pongCreation(pongX, pongY);
  pongMove();
  gameBoundaries();
  // computerPlayerAI();
  // Animate the game
  window.requestAnimationFrame(renderGameState); //https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
};

const startGame = () => {
  humanScore = 0;
  computerScore = 0;
  pongCreateRandomMovement();
  renderGameState();

  //Mouse movement
  canvas.addEventListener("mousemove", (event) => {
    humanPaddleMove = true;
    humanPaddle.y = event.clientY - canvasPos / 4;

    if (humanPaddle.y < paddleSpeed) {
      humanPaddle.y = 0;
    }
    if (humanPaddle.y > gameBoardHeight - humanPaddle.height) {
      humanPaddle.y = gameBoardHeight - humanPaddle.height;
    }
  });

  // Arrow key movement
  window.addEventListener("keydown", (event) => {
    humanPaddleMove = true;
    const arrow = event.keyCode;
    if (arrow === 38) {
      if (humanPaddle.y > 0) {
        humanPaddle.y -= paddleSpeed;
      }
    } else if (arrow === 40) {
      if (humanPaddle.y < gameBoardHeight - humanPaddle.height) {
        humanPaddle.y += paddleSpeed;
      }
    }
  });
};

// *** EVENT LISTENERS
//btnEasy.addEventListener("click", easyMode);
//btnMedium.addEventListener("click", mediumMode);
//btnHard.addEventListener("click", hardMode);

// Mouse

// Start Pong
startGame();
