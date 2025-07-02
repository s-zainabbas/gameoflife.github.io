const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const toggleBtn = document.getElementById('toggleBtn');
const zoomSlider = document.getElementById('zoomSlider');

let cellSize = parseInt(zoomSlider.value);
let rows = Math.floor(canvas.height / cellSize);
let cols = Math.floor(canvas.width / cellSize);
let isRunning = true;

function createRandomGrid() {
  const grid = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      row.push(Math.random() > 0.8 ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}

let grid = createRandomGrid();

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) {
        ctx.fillStyle = 'black';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      } else {
        ctx.strokeStyle = '#ddd';
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function countNeighbors(x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        count += grid[ny][nx];
      }
    }
  }
  return count;
}

function updateGrid() {
  const newGrid = [];
  for (let y = 0; y < rows; y++) {
    const newRow = [];
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(x, y);
      if (grid[y][x] === 1) {
        newRow.push(neighbors === 2 || neighbors === 3 ? 1 : 0);
      } else {
        newRow.push(neighbors === 3 ? 1 : 0);
      }
    }
    newGrid.push(newRow);
  }
  grid = newGrid;
}

function loop() {
  if (isRunning) {
    updateGrid();
    drawGrid();
  }
  requestAnimationFrame(loop);
}

toggleBtn.addEventListener('click', () => {
  isRunning = !isRunning;
  toggleBtn.textContent = isRunning ? 'Pause' : 'Play';
});

zoomSlider.addEventListener('input', () => {
  cellSize = parseInt(zoomSlider.value);
  rows = Math.floor(canvas.height / cellSize);
  cols = Math.floor(canvas.width / cellSize);
  grid = createRandomGrid();
  drawGrid();
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    grid[y][x] = grid[y][x] === 1 ? 0 : 1;
    drawGrid();
  }
});

drawGrid();
loop();
