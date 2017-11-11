import { delay } from 'redux-saga';
import { select, call, take, race } from 'redux-saga/effects';
import { INIT, PAUSE, CLEAR, START } from '../store/actions';

let canvasNode = null;
let board = null;
const bgColor = '#373440';
const newGenerationColor = '#f2ebbf';
const oldGenerationCOlor = '#f06060';

function initCanvas(canvas) {
  canvasNode = canvas;
  canvasNode.offscreenCanvas = document.createElement('canvas');
  canvasNode.offscreenCanvas.width = canvas.width;
  canvasNode.offscreenCanvas.height = canvas.height;
}

function getAmountOfNeighbors(rowIndex, cellIndex) {
  let sum = 0;
  for (let row = -1; row <= 1; row += 1) {
    for (let col = -1; col <= 1; col += 1) {
      let newRowIndex = rowIndex + row;
      if (newRowIndex < 0) {
        newRowIndex = board.length - 1;
      } else if (newRowIndex > board.length - 1) {
        newRowIndex = 0;
      }
      let newCellIndex = cellIndex + col;
      if (newCellIndex < 0) {
        newCellIndex = board[0].length - 1;
      } else if (newCellIndex > board[0].length - 1) {
        newCellIndex = 0;
      }
      if (
        board[newRowIndex][newCellIndex] !== 0 &&
        (newRowIndex !== rowIndex || newCellIndex !== cellIndex)
      ) {
        sum += 1;
      }
    }
  }
  return sum;
}

function updateBoard() {
  let hasBoardUpdate = false;
  const newBoard = board.map((row, rowIndex) => {
    let hasRowUpdate = false;
    const newRow = row.map((cell, cellIndex) => {
      // only do something if the cell is dead or alive
      const aliveNeighbors = getAmountOfNeighbors(rowIndex, cellIndex);
      if (!cell && aliveNeighbors !== 3) {
        return cell;
      }
      if (!cell) {
        hasRowUpdate = true;
        return 2;
      }
      if (aliveNeighbors > 3 || aliveNeighbors < 2) {
        hasRowUpdate = true;
        return 0;
      }
      if (cell === 2) {
        hasRowUpdate = true;
      }
      return 1;
    });
    if (hasRowUpdate) {
      hasBoardUpdate = true;
      return newRow;
    }
    return row;
  });
  if (hasBoardUpdate) {
    board = newBoard;
    return true;
  }
  return false;
}

function* renderBoard() {
  if (canvasNode && board) {
    const { cellSize } = yield select(state => ({
      cellSize: state.cellSize,
    }));
    const offscreenCtx = canvasNode.offscreenCanvas.getContext('2d');
    offscreenCtx.fillStyle = bgColor;
    offscreenCtx.fillRect(0, 0, canvasNode.width, canvasNode.height);
    board.forEach((row, rowIndex) => {
      const y = Math.floor(rowIndex * cellSize);
      row.forEach((col, colIndex) => {
        if (col === 1) {
          offscreenCtx.fillStyle = oldGenerationCOlor;
          offscreenCtx.fillRect(Math.floor(colIndex * cellSize), y, cellSize, cellSize);
        } else if (col === 2) {
          offscreenCtx.fillStyle = newGenerationColor;
          offscreenCtx.fillRect(Math.floor(colIndex * cellSize), y, cellSize, cellSize);
        }
      });
    });
  }
  const ctx = canvasNode.getContext('2d');
  ctx.drawImage(canvasNode.offscreenCanvas, 0, 0);
}

function* timer() {
  const speed = yield select(state => state.speed);
  // initial render
  yield call(renderBoard);
  while (true) {
    // repeated render
    const result = yield race([
      call(delay, speed),
      take([PAUSE, CLEAR]),
    ]);
    if (result[1]) {
      yield take(START);
    }
    const hasUpdate = yield call(updateBoard);
    if (hasUpdate) {
      yield call(renderBoard);
    }
  }
}

function* main() {
  const { payload } = yield take(INIT);
  yield call(initCanvas, payload);
  const { rows, cols } = yield select(state => ({
    rows: state.rows,
    cols: state.cols,
  }));
  board = Array.from(
    { length: rows },
    () => Array.from(
      { length: cols },
      () => {
        if (Math.random() <= 0.2) {
          return 1;
        }
        return 0;
      },
    ),
  );
  yield call(timer);
}

export default main;
