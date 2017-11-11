import { delay } from 'redux-saga';
import { select, call, take, race } from 'redux-saga/effects';
import { INIT, PAUSE, CLEAR, START } from '../store/actions';

let canvasNode = null;
let board = null;
let tileWidth = 0;
let tileHeight = 0;
const bgColor = '#2b2b2b';
const newGenerationColor = '#e68383';
const oldGenerationCOlor = '#d65c5c'

function* main() {
  yield take(INIT);
  const { sizeX, sizeY, canvas } = yield select(state => ({
    sizeX: state.sizeX,
    sizeY: state.sizeY,
    canvas: state.canvas,
  }));
  canvasNode = canvas;
  tileWidth = canvas.width / sizeX;
  tileHeight = canvas.height / sizeY;
  canvasNode.offscreenCanvas = document.createElement('canvas');
  canvasNode.offscreenCanvas.width = canvas.width;
  canvasNode.offscreenCanvas.height = canvas.height;
  board = Array.from({ length: sizeY }, (_, i) => Array.from({ length: sizeX }, () => Math.random() <= 0.2 ? 1 : 0));
  yield call(timer);
}

function* timer() {
  const speed = yield select(state => state.speed);
  // initial render
  yield call(renderBoard)
  while (true) {
    // repeated render
    const result = yield race([
      call(delay, speed),
      take([ PAUSE, CLEAR ]),
    ]);
    if (result[1]) {
      yield take(START);
    }
    const hasUpdate = yield call(updateBoard);
    if (hasUpdate) {
      yield call(renderBoard)
    }
  }
}

function renderBoard() {
  if (canvasNode && board) {
    const offscreenCtx = canvasNode.offscreenCanvas.getContext('2d');
    offscreenCtx.fillStyle = bgColor;
    offscreenCtx.fillRect(0, 0, canvasNode.width, canvasNode.height);
    board.forEach((row, rowIndex) => {
      const y = Math.floor(rowIndex * tileHeight);
      row.forEach((col, colIndex) => {
        if (col === 1) {
          offscreenCtx.fillStyle = oldGenerationCOlor;  
          offscreenCtx.fillRect(Math.floor(colIndex * tileWidth), y, tileWidth, tileHeight);
        } else if (col === 2) {
          offscreenCtx.fillStyle = newGenerationColor;  
          offscreenCtx.fillRect(Math.floor(colIndex * tileWidth), y, tileWidth, tileHeight);
        }
      });
    })
  }
  const ctx = canvasNode.getContext('2d');
  ctx.drawImage(canvasNode.offscreenCanvas, 0, 0);
}

function updateBoard() {
  let hasBoardUpdate = false;
  let lastRowUpdate = 0;
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
      lastRowUpdate = rowIndex;
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

function getAmountOfNeighbors(rowIndex, cellIndex) {
  let sum = 0;
  for (let row = -1; row <= 1; row += 1) {
    for (let col = -1; col <= 1; col += 1) {
      const newRowIndex = (rowIndex + row) < 0
        ? board.length - 1
        : (rowIndex + row) > board.length - 1
          ? 0
          : rowIndex + row;
      const newCellIndex = (cellIndex + col) < 0
        ? board[0].length - 1
        : (cellIndex + col) > board[0].length - 1
          ? 0
          : cellIndex + col;
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

export default main;
