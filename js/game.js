const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const colors = ["#FF9500", "#2104f2", "#FF0033", "#047431", "#459211"];
const pointShow = document.querySelector(".point");
const levelShow = document.querySelector(".level");
const lvl = document.querySelector(".lvl");
const btn = document.querySelector("#startButton");
let gameRunning = true;
let isGameStarted = false;
let ballMoving = false;
let level = 1; // 初期レベル
let speed = 10 / 3;

let points = 0;
let nowPoint = 0;
let lastCollisionTime = 0; // 前回の衝突時刻を記録

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
let brickRowCount = 6;
let brickColumnCount = 12;
let brickWidth = 35;
let brickHeight = 20;
let brickPadding = 3;
let brickOffsetTop = 10;
let brickOffsetLeft = 13;
let bricks = [];
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
lvl.addEventListener("change", function (event) {
  level = parseInt(event.target.value, 10); // 選択された値を数値として取得
  brickRowCount = 5 + level;
  if (level === 1) {
    speed = 10 / 3;
  } else if (level === 2) {
    speed = 4;
  } else if (level === 3) {
    speed = 4.8;
  }
});
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // デフォルト動作（スクロールなど）を完全に無効化
  }
});
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.code === "KeyD") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.code === "KeyA") {
    leftPressed = true;
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.code === "Space") {
    // Spaceキーで発射
    if (!ballMoving) {
      dx = speed; // ボールの水平速度
      dy = -speed; // ボールの垂直速度
      ballMoving = true;
    }
  }
}
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.code === "KeyD") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.code === "KeyA") {
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
  btn.removeEventListener("click", pre);
  x = paddleX + paddleWidth / 2; // ボールをパドル中央に配置
  y = paddleY - ballRadius; // ボールをパドルの上に配置
  dx = 0; // 初期速度は0
  dy = 0; // 初期速度は0
  pointShow.innerHTML = points;
  levelShow.innerHTML = level;
  ballMoving = false; // ボールは静止状態
  paddleX = (canvas.width - paddleWidth) / 2;
  paddleY = canvas.height - paddleHeight;
  rightPressed = false;
  leftPressed = false;
  upPressed = false;
  downPressed = false;
  gameRunning = true;
  isGameStarted = true;
  lvl.style.display = "none";
  for (let r = 0; r < brickRowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      const random = Math.floor(Math.random() * 5);
      bricks[r][c] = {
        x: 0,
        y: 0,
        status: 1,
        color: colors[random],
        point: random * level,
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
    gameRunning = false;
    level++; // レベルを1増加
    speed *= 1.2;
    brickRowCount = 5 + level;
    isGameStarted = false;
    const messageDiv = document.createElement("div");
    messageDiv.style.position = "absolute";
    messageDiv.style.top = "50%";
    messageDiv.style.left = "50%";
    messageDiv.style.transform = "translate(-50%, -50%)";
    messageDiv.style.padding = "20px";
    messageDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    messageDiv.style.color = "white";
    messageDiv.style.textAlign = "center";
    messageDiv.style.borderRadius = "10px";
    messageDiv.innerHTML = `<h2>Congratulations!</h2><button id='nextLevelButton'>Next Level</button>`;
    document.body.appendChild(messageDiv);
    const nextLevelButton = document.getElementById("nextLevelButton");
    nextLevelButton.style.marginTop = "10px";
    nextLevelButton.style.padding = "10px 20px";
    nextLevelButton.style.fontSize = "16px";
    nextLevelButton.style.cursor = "pointer";
    nextLevelButton.addEventListener("click", () => {
      document.body.removeChild(messageDiv);
      pre(); // 次のレベルを初期化
    });

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
  if (!ballMoving) {
    // ボールが動いていないときはパドルに追随
    x = paddleX + paddleWidth / 2;
    y = paddleY - ballRadius;
  }

  checkBrickCollision();
  checkClear();
  x += dx;
  y += dy;
  // if (
  //   y < 0 ||
  //   (y + ballRadius >= paddleY && x >= paddleX && x <= paddleX + paddleWidth) ||
  //   (x + ballRadius >= paddleX &&
  //     x - ballRadius <= paddleX + paddleWidth &&
  //     y + ballRadius > paddleY &&
  //     y < paddleY + paddleHeight)
  // ) {
  //   dy = -dy;
  // }
  if (x < 0 || x > canvas.width) dx = -dx;
  if (y < 0) dy = -dy;

  checkCollision();

  //失敗判定
  if (y > canvas.height) {
    alert("you lose");
    btn.addEventListener("click", pre);
    btn.innerHTML = "ゲーム開始";
    gameRunning = false;
    level = 1; // レベル１に戻る
    speed = 10 / 3;
    brickRowCount = 6;
    isGameStarted = false;
    points = 0;
    lvl.style.display = "block";
    return;
  }

  requestAnimationFrame(draw);
}
function checkCollision() {
  const currentTime = Date.now(); // 現在時刻を取得
  if (currentTime - lastCollisionTime < 300) {
    return;
  }

  if (
    y + ballRadius >= paddleY && // ボールの下端がパドルの上端を超えた場合
    y + ballRadius <= paddleY + paddleHeight && // ボールがパドルの垂直範囲内にある
    x + ballRadius > paddleX && // ボールの右端がパドルの左端を超える
    x - ballRadius < paddleX + paddleWidth
  ) {
    // ボールの左端がパドルの右端を超えない
    dy = -dy;
    lastCollisionTime = currentTime; // 衝突時刻を記録
  }
}

btn.addEventListener("click", pre);
