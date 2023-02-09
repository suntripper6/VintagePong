// *** VARIABLES
const { body } = document;

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const gameBoardWidth = canvas.width;
const gameBoardHeight = canvas.height;
const windowScreenHeight = window.screen.height;
const canvasPos = windowScreenHeight / 2 - canvas.height / 2;

const pongHitSound = document.createElement("audio");
pongHitSound.src = "./assets/soundfx/pongHit.mp3";

const winSound = document.createElement("audio");
winSound.src = "./assets/soundfx/win-sfx-38507.mp3";

const backgroundSound = document.createElement("audio");
backgroundSound.src = "./assets/soundfx/happy-14585.mp3";
backgroundSound.volume = 0.3;

const scoreText = document.querySelector("#score");
const btnEasy = document.querySelector("#easy");
const btnMedium = document.querySelector("#medium");
const btnHard = document.querySelector("#hard");
const btnStop = document.querySelector("#stop");
const showWinner = document.querySelector("#winner");

// Center line
const centerLineWidth = 20;
const centerLineHeight = 700;

// Score & etc.
const winningScore = 7;
let computerSpeed = 2;
let humanScore = 0;
let computerScore = 0;
let isGameOver = true;
let winner = "";

// Pong
const pongRadius = 12;
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

let humanPaddle = {
  x: 0,
  y: 0,
  width: 20,
  height: 150,
  color: "#dddddd",
  xOffSet: 20,
};

let computerPaddle = {
  x: gameBoardWidth - 20,
  y: gameBoardHeight - 150,
  width: 20,
  height: 150,
  color: "#dddddd",
  xOffSet: 20,
};

// *** FUNCTIONS

const randomFive = () => {
  return Math.round(Math.random() * 5) + 1;
};

const renderGameBoard = () => {
  // Render Canvas
  ctx.fillStyle = "#4194FA";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Center Line
  ctx.fillStyle = "#DDDDDD";
  ctx.fillRect(490, 0, centerLineWidth, centerLineHeight);

  // Render Score
  ctx.font = "64px Minecraft";
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
    pongXTrajectory = randomFive();
  } else {
    pongXTrajectory = -randomFive();
  }
  // Vertical
  if (Math.round(Math.random()) === 1) {
    pongYTrajectory = randomFive();
  } else {
    pongYTrajectory = -randomFive();
  }
  //pongReset();
  //pongCreation(pongX, pongY);
};

const gameBoundaries = () => {
  // Top boundary
  if (pongY - pongRadius <= 0 || pongY + pongRadius >= gameBoardHeight) {
    pongHitSound.play();
    pongYTrajectory *= -1;
  }

  // Paddle hits
  // human paddle contact
  if (pongX <= humanPaddle.x + humanPaddle.width + pongRadius) {
    if (pongY > humanPaddle.y && pongY < humanPaddle.y + humanPaddle.height) {
      pongHitSound.play();
      pongX = humanPaddle.x + humanPaddle.width + pongRadius;
      pongXTrajectory *= -1;
      pongSpeed += 1;
    } else if (pongX <= 0) {
      pongHitSound.play();
      pongReset();
      computerScore++;
    }
  }

  // computer paddle contact
  if (pongX >= computerPaddle.x - pongRadius) {
    if (
      pongY > computerPaddle.y &&
      pongY < computerPaddle.y + computerPaddle.height
    ) {
      pongHitSound.play();
      pongX = computerPaddle.x - pongRadius;
      pongXTrajectory *= -1;
      pongSpeed += 1;
    } else if (pongX >= 0) {
      pongHitSound.play();
      pongReset();
      humanScore++;
    }
  }
};

// computerPaddle
// if paddleY < 0 then set paddleY original xy x: gameBoardWidth - 20, y: gameBoardHeight - 150,
const computerPlayerAI = () => {
  if (humanPaddleMove) {
    if (computerPaddle.y + pongRadius <= pongY) {
      computerPaddle.y += randomFive() * 2;
    } else {
      computerPaddle.y -= randomFive() * 2;
    }
  }
};

//#region Game Over
const gameBoardFinale = () => {
  backgroundSound.pause();
  winSound.play();
  isGameOver = true;
  canvas.hidden = true;
  btnEasy.parentNode.removeChild(btnEasy);
  btnMedium.parentNode.removeChild(btnMedium);
  btnHard.parentNode.removeChild(btnHard);
  btnStop.style.background = "#4194FA";
  btnStop.textContent = "Play Again?";
};

const gameOver = () => {
  if (humanScore === winningScore) {
    gameBoardFinale();
    showWinner.innerText = "Hooman Wins! Winner Winner Chicken Dinner!"; // placeholder
  } else if (computerScore === winningScore) {
    gameBoardFinale();
    showWinner.innerText = "Computer Wins! HUMAN LOSER!"; // placeholder
  }
};
//#endregion Game Over

const renderGameState = () => {
  renderGameBoard();
  createPaddles();
  pongCreation(pongX, pongY);
  pongMove();
  gameBoundaries();
  computerPlayerAI();
  gameOver();
  // Animate the game
  if (isGameOver === false) {
    window.requestAnimationFrame(renderGameState); //https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  }
};

const startGame = () => {
  humanScore = 0;
  computerScore = 0;
  isGameOver = false;
  backgroundSound.play();
  pongCreateRandomMovement();
  pongReset();
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
    const keyPressDown = event.key;
    console.log(keyPressDown);
    if (keyPressDown === "ArrowUp") {
      if (humanPaddle.y > 0) {
        humanPaddle.y -= paddleSpeed;
      }
    } else if (keyPressDown === "ArrowDown") {
      if (humanPaddle.y < gameBoardHeight - humanPaddle.height) {
        humanPaddle.y += paddleSpeed;
      }
    }
    // if (keyPressDown === "q") {
    //   if (computerPaddle.y > 0) {
    //     computerPaddle.y -= paddleSpeed;
    //   }
    // } else if (keyPressDown === "w") {
    //   if (computerPaddle.y < gameBoardHeight - computerPaddle.height) {
    //     computerPaddle.y += paddleSpeed;
    //   }
    // }
  });
};

renderGameBoard();
createPaddles();
pongCreation(pongX, pongY);

//#region Button Events
const disablePlayButtons = () => {
  btnEasy.disabled = true;
  btnMedium.disabled = true;
  btnHard.disabled = true;
};

// const playMode = () => {
//   if (!isGameOver === false) {
//     canvas.fillStyle = "false";
//   }
//   pongX = gameBoardWidth / 2;
//   pongY = gameBoardHeight / 2;
//   computerSpeed = 2;
//   pongSpeed = 1;
//   pongSpeedX = 1;
//   pongSpeedY = 1;
//   pongXTrajectory = 0;
//   pongYTrajectory = 0;
//   disablePlayButtons();
//   btnEasy.removeEventListener("click", easyMode);
//   startGame();
// };

const easyMode = () => {
  if (!isGameOver === false) {
    canvas.fillStyle = "false";
  }
  pongX = gameBoardWidth / 2;
  pongY = gameBoardHeight / 2;
  computerSpeed = 2;
  pongSpeed = 1;
  pongSpeedX = 1;
  pongSpeedY = 1;
  pongXTrajectory = 0;
  pongYTrajectory = 0;
  disablePlayButtons();
  btnEasy.removeEventListener("click", easyMode);
  startGame();
};

const mediumMode = () => {
  humanScore = 0;
  computerScore = 0;
  pongX = gameBoardWidth / 2;
  pongY = gameBoardHeight / 2;
  computerSpeed = 10;
  pongSpeed = 5;
  pongSpeedX = 5;
  pongSpeedY = 5;
  pongXTrajectory = 1;
  pongYTrajectory = 1;
  disablePlayButtons();
  btnMedium.removeEventListener("click", mediumMode);
  startGame();
};

const hardMode = () => {
  humanScore = 0;
  computerScore = 0;
  pongX = gameBoardWidth / 2;
  pongY = gameBoardHeight / 2;
  computerSpeed = 50;
  pongSpeed = 1;
  pongSpeedX = 10;
  pongSpeedY = 10;
  pongXTrajectory = randomFive() * 10;
  pongYTrajectory = randomFive() * 10;
  disablePlayButtons();
  btnMedium.removeEventListener("click", mediumMode);
  startGame();
};

btnEasy.addEventListener("click", easyMode);
btnMedium.addEventListener("click", mediumMode);
btnHard.addEventListener("click", hardMode);

btnStop.addEventListener("click", () => {
  window.location.reload();
  gameOver();
});
//#endregion Button Events
