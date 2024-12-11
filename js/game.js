const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const colors = ["#FF9500", "#2104f2", "#FF0033", "#047431", "#459211"];
const pointShow = document.querySelector(".point");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
let brickRowCount = 7;
let brickColumnCount = 12;
let brickWidth = 35;
let brickHeight = 20;
let brickPadding = 3;
let brickOffsetTop = 10;
let brickOffsetLeft = 13;
let bricks = [];
let points = 0;
let gameRunning = true;
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = false;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#3591a2";
  ctx.fill();
  ctx.closePath();
}

// function drawBricks() {
//   for (let c = 0; c < brickColumnCount; c++) {
//     for (let r = 0; r < brickRowCount; r++) {
//       if (bricks[c][r].status === 1) {
//         let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
//         let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
//         bricks[c][r].x = brickX;
//         bricks[c][r].y = brickY;
//         ctx.beginPath();
//         ctx.rect(brickX, brickY, brickWidth, brickHeight);
//         ctx.fillStyle = bricks[c][r].color;
//         ctx.fill();
//         ctx.closePath();
//       }
//     }
//   }
// }

function drawBricks() {
  for (let r = 0; r < brickRowCount; r++) {
    for (let c = 0; c < brickColumnCount; c++) {
      if (bricks[r][c].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[r][c].x = brickX;
        bricks[r][c].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[r][c].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function checkBrickCollision() {
  for (let r = 0; r < brickRowCount; r++) {
    for (let c = 0; c < brickColumnCount; c++) {
      let brick = bricks[r][c];
      if (brick.status === 1) {
        // ブロックがまだ存在する場合
        if (
          x > brick.x && // ボールのx座標がブロックの左端より右
          x < brick.x + brickWidth && // ボールのx座標がブロックの右端より左
          y > brick.y && // ボールのy座標がブロックの上端より下
          y < brick.y + brickHeight // ボールのy座標がブロックの下端より上
        ) {
          dy = -dy; // ボールの垂直方向の速度を反転
          brick.status = 0; // ブロックを「壊れた」状態に設定
          points += brick.point;
          pointShow.innerHTML = points;
        }
      }
    }
  }
}
function pre() {
  points = 0;
  pointShow.innerHTML = points;
  x = canvas.width / 2;
  y = canvas.height - 30;
  paddleX = (canvas.width - paddleWidth) / 2;
  paddleY = canvas.height - paddleHeight;
  rightPressed = false;
  leftPressed = false;
  upPressed = false;
  downPressed = false;
  gameRunning = true;
  for (let r = 0; r < brickRowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      const random = Math.floor(Math.random() * 5);
      bricks[r][c] = {
        x: 0,
        y: 0,
        status: 1,
        color: colors[random],
        point: random,
      };
    }
  }
  draw();
}
function checkClear() {
  if (!gameRunning) return;
  let clear = true;
  for (let r = 0; r < brickRowCount; r++) {
    for (let c = 0; c < brickColumnCount; c++) {
      if (bricks[r][c].status !== 0) {
        clear = false;
        break;
      }
    }
    if (!clear) {
      break;
    }
  }

  if (clear) {
    bricks = [];
    alert("you win");
    gameRunning = false;
    return;
  }
}
function draw() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  } else if (upPressed && paddleY > canvas.height - 50) {
    paddleY -= 7;
  } else if (downPressed && paddleY < canvas.height - paddleHeight) {
    paddleY += 7;
  }
  checkBrickCollision();
  checkClear();
  x += dx;
  y += dy;
  if (x < 0 || x > canvas.width) dx = -dx;
  if (
    y < 0 ||
    (y + ballRadius >= paddleY && x >= paddleX && x <= paddleX + paddleWidth) ||
    (x + ballRadius >= paddleX &&
      x - ballRadius <= paddleX + paddleWidth &&
      y + ballRadius > paddleY &&
      y < paddleY + paddleHeight)
  )
    dy = -dy;

  if (y > canvas.height) {
    alert("you lose");
    return;
  }
  requestAnimationFrame(draw);
}

const btn = document.querySelector("#startButton");
btn.addEventListener("click", pre);
