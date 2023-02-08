// *** VARIABLES
const { body } = document;

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const gameBoardWidth = canvas.width;
const gameBoardHeight = canvas.height;
const windowScreenHeight = window.screen.height;
const canvasPos = windowScreenHeight / 2 - canvas.height / 2;

// FONT COURTESY OF: https://www.dafont.com/minecraft.font
// Tylus Dawkins knowledge drop: https://dev.to/thehomelessdev/how-to-add-a-custom-font-to-an-html-canvas-1m3g
const scoreFont = new FontFace(
  "scoreFont",
  "url(./assets/fonts/Minecraft.ttf)"
);
scoreFont.load().then(function (font) {
  document.fonts.add(font);
  console.log("font loaded");
});

const scoreText = document.querySelector("#score");
const btnEasy = document.querySelector("#easy");
const btnMedium = document.querySelector("#medium");
const btnHard = document.querySelector("#hard");
const btnStop = document.querySelector("#stop");

// Center line
const centerLineWidth = 20;
const centerLineHeight = 700;

// Score & etc.
let computerSpeed = 2;
let humanScore = 0;
let computerScore = 0;
let isGameOver = false;
let winner = "";
let winningScore = 7;

// Pong
const pongRadius = 12.5;
let pongSpeedX = 1;
let pongSpeedY = 1;
let pongSpeed = 0;
let pongX = gameBoardWidth / 2;
let pongY = gameBoardHeight / 2;
let pongXTrajectory = 0;
let pongYTrajectory = 0;

// Paddle
let paddlePongContact = true;
let paddleSpeed = 50;
let humanPaddleMove = false;
//let paddlePadding = 20; --need to resolve on the x!

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

const random = () => {
  return Math.round(Math.random() * 5) + 1;
};

const renderGameBoard = () => {
  // Render Canvas
  ctx.fillStyle = "#4194FA";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Center Line
  ctx.fillStyle = "#DDDDDD";
  ctx.fillRect(490, 0, centerLineWidth, centerLineHeight);

  createGameScore();
};

const createGameScore = () => {
  // Render Score
  ctx.font = "64px scoreFont";
  //ctx.font = "64px monospace";
  ctx.fillText(humanScore, 425, canvas.height / 14 + 20);
  ctx.fillText(computerScore, 535, canvas.height / 14 + 20);
};

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
  let randHeight = Math.random() * (gameBoardHeight - 1) + 1;
  pongX = gameBoardWidth / 2;
  pongY = randHeight;
  paddlePongContact = false;
};

const pongMove = () => {
  pongX += pongSpeed * pongXTrajectory;
  pongY += pongSpeed * pongYTrajectory;
};

const pongCreateRandomMovement = () => {
  pongSpeed = 1;
  // Horizontal
  if (Math.round(Math.random()) === 1) {
    pongXTrajectory = random();
  } else {
    pongXTrajectory = -random();
  }
  // Vertical
  if (Math.round(Math.random()) === 1) {
    pongYTrajectory = random();
  } else {
    pongYTrajectory = -random();
  }
  pongReset();
  pongCreation(pongX, pongY);
};

const gameBoundaries = () => {
  // Top boundary
  if (pongY <= 0 + pongRadius) {
    pongYTrajectory *= -1;
  }
  // Bottom boundary  - Add to computerAI for paddle boundary
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
    } else if (pongX <= 0) {
      computerScore++;
      pongReset();
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
    } else if (pongX > 0) {
      humanScore++;
      pongReset();
    }
  }
};

// computerPaddle
const computerPlayerAI = () => {
  // redefine computerSpeed depeding on button clicked
  // computerPaddle.y = gameBoardHeight - computerPaddle.height;
  if (humanPaddleMove) {
    console.log("human moved");
    if (computerPaddle.y + pongRadius < pongY) {
      computerPaddle.y += random() * 2;
    } else {
      computerPaddle.y -= random() * 2;
    }
  }
};

const gameOver = () => {
  if (humanScore === winningScore || computerScore === winningScore) {
    isGameOver = true;
    if (humanScore === winningScore) {
      winner = "Human";
    } else {
      winner = "Computer";
    }
  }
  scoreText.remove();
  humanScore = 0;
  computerScore = 0;
  pongX = gameBoardWidth / 2;
  pongY = gameBoardHeight / 2;
  pongSpeed = 0;
  pongXTrajectory = 0;
  pongYTrajectory = 0;
  //startGame();
};

const renderGameState = () => {
  renderGameBoard();
  createPaddles();
  pongCreation(pongX, pongY);
  pongMove();
  gameBoundaries();
  computerPlayerAI();
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
    humanPaddle.y = event.clientY - canvasPos / 2;

    if (humanPaddle.y < paddleSpeed) {
      humanPaddle.y = 0;
    }
    if (humanPaddle.y > gameBoardHeight - humanPaddle.height) {
      humanPaddle.y = gameBoardHeight - humanPaddle.height;
    }

    canvas.style.cursor = "none";
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

renderGameBoard();
createPaddles();
pongCreation(pongX, pongY);

btnEasy.addEventListener("click", () => {
  humanScore = 0;
  computerScore = 0;
  pongX = gameBoardWidth / 2;
  pongY = gameBoardHeight / 2;
  computerSpeed = 0;
  pongSpeed = -20;
  pongXTrajectory = -1;
  pongYTrajectory = -1;
  startGame();
});

btnMedium.addEventListener("click", () => {
  humanScore = 0;
  computerScore = 0;
  pongX = gameBoardWidth / 2;
  pongY = gameBoardHeight / 2;
  computerSpeed = 5;
  paddleSpeed = 75;
  pongSpeed = 5;
  pongXTrajectory = 3;
  pongYTrajectory = 3;
  startGame();
});

btnHard.addEventListener("click", () => {
  humanScore = 0;
  computerScore = 0;
  pongX = gameBoardWidth / 2;
  pongY = gameBoardHeight / 2;
  computerSpeed = 10;
  paddleSpeed = 100;
  pongSpeed = random() * 10;
  pongXTrajectory = 5;
  pongYTrajectory = 5;
  startGame();
});

btnStop.addEventListener("click", () => {
  gameOver();
});

// Start Pong
//startGame();
