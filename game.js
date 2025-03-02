const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameOver = false;

// Cyberpunk colors
const colors = {
    snake: {
        gradient: ['#e100ff', '#8a2be2'],
        glow: '#e100ff'
    },
    food: {
        color: '#00ff9f',
        glow: '#00ff9f'
    },
    background: '#0a0a0f'
};

document.addEventListener('keydown', changeDirection);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameOver) {
        resetGame();
    }
});

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 1;
    dy = 0;
    score = 0;
    gameOver = false;
    scoreElement.textContent = `Score: ${score}`;
    gameOverScreen.style.display = 'none';
    drawGame();
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function drawGame() {
    if (gameOver) {
        gameOverScreen.style.display = 'block';
        return;
    }

    setTimeout(drawGame, 100);
    clearCanvas();
    drawGrid();
    moveSnake();
    drawFood();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(138, 43, 226, 0.1)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function drawSnake() {
    // Create gradient for snake body
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors.snake.gradient[0]);
    gradient.addColorStop(1, colors.snake.gradient[1]);

    snake.forEach((segment, index) => {
        ctx.fillStyle = gradient;
        ctx.shadowColor = colors.snake.glow;
        ctx.shadowBlur = 15;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        
        // Reset shadow for next draw
        ctx.shadowBlur = 0;
    });
}

function drawFood() {
    ctx.fillStyle = colors.food.color;
    ctx.shadowColor = colors.food.glow;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    const centerX = food.x * gridSize + gridSize / 2;
    const centerY = food.y * gridSize + gridSize / 2;
    ctx.arc(centerX, centerY, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision with wrapping
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    // Self collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

// Start game with initial direction
dx = 1;
dy = 0;
drawGame();
