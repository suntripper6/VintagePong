// MISC VARIABLES

// Canvas & context
const body = document.querySelector("body");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const width = 1000;
const height = 700;

// Center line
const centerLineWidth = 20;
const centerLineHeight = 700;

// Pong
const pongWidth = 20;
const pongHeight = 20;

// Paddle
const paddleWidth = 25;
const paddleHeight = 150;
const paddleLeftY = 250;
const paddleRightY = 250;

// Score
let scorePlayerLeft = 0;
let scorePlayerRight = 0;

const gameBoardRender = () => {
  // Render Canvas
  ctx.fillStyle = "#4194FA";
  ctx.fillRect(0, 0, width, height);

  // Center Line
  ctx.fillStyle = "#DDDDDD";
  ctx.fillRect(490, 0, centerLineWidth, centerLineHeight);

  // Render Pong
  ctx.fillStyle = "#000000";
  ctx.fillRect(490, 320, pongWidth, pongHeight);

  // Render Paddles
  ctx.fillStyle = "#DDDDDD";
  // Paddle Left
  ctx.fillRect(40, paddleLeftY, paddleWidth, paddleHeight);
  // Paddle Right
  ctx.fillRect(935, paddleRightY, paddleWidth, paddleHeight);

  // Render Score
  ctx.font = "64px monospace";
  ctx.fillText(scorePlayerLeft, 425, canvas.height / 14 + 20);
  ctx.fillText(scorePlayerRight, 535, canvas.height / 14 + 20);
};

const drawCanvas = () => {
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);
  gameBoardRender();
};

drawCanvas();
