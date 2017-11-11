/* eslint-disable react/jsx-filename-extension, max-len, no-confusing-arrow, react/react-in-jsx-scope, react/prop-types, react/no-multi-comp */
/* global React, Redux, ReactRedux, ReduxActions, ReduxSaga, ReactDOM  */

window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 999999999999;

const { createStore, applyMiddleware, bindActionCreators } = Redux;
const { Provider, connect } = ReactRedux;
const { createAction, handleActions } = ReduxActions;
const { default: createSagaMiddleware, effects, delay } = ReduxSaga;
const {
  select,
  call,
  take,
  race,
  fork,
  takeEvery,
  put,
} = effects;
// eslint-disable-next-line
const styled = styled.default;

const inputRegex = /^\d{1,3}$/;
const speedRegex = /^\d{1,5}$/;

/* DATA */

let canvasNode = null;
let board = null;
const bgColor = '#373440';
const newGenerationColor = '#f2ebbf';
const oldGenerationCOlor = '#f06060';

/* ACTIONS */

const START = 'START';
const PAUSE = 'STOP';
const CLEAR = 'CLEAR';
const INIT = 'INIT';
const SETTINGS = 'SETTINGS';
const SPEED = 'SPEED';
const CELL = 'CELL';
const CYCLE = 'CYCLE';
const RESET_CYCLE = 'RESET_CYCLE';

const start = createAction(START);
const pause = createAction(PAUSE);
const clear = createAction(CLEAR);
const init = createAction(INIT);
const settings = createAction(SETTINGS);
const setSpeed = createAction(SPEED);
const addCell = createAction(CELL);
const cycle = createAction(CYCLE);
const resetCycle = createAction(RESET_CYCLE);

/* REDUCERS */

const createReducer = defaultState => handleActions(
  {
    [START]: state => ({
      ...state,
      active: true,
    }),
    [PAUSE]: state => ({
      ...state,
      active: false,
    }),
    [CLEAR]: state => ({
      ...state,
      active: false,
      board: null,
    }),
    [SETTINGS]: (state, { payload: { cols, rows, cellSize } }) => ({
      ...state,
      cols,
      rows,
      cellSize,
      active: true,
    }),
    [SPEED]: (state, { payload }) => ({
      ...state,
      speed: payload,
    }),
    [CYCLE]: state => ({
      ...state,
      cycles: state.cycles + 1,
    }),
    [RESET_CYCLE]: state => ({
      ...state,
      cycles: 0,
    }),
  },
  defaultState,
);

/* REDUX SETUP */

const INITIAL_STATE = {
  active: true,
  cols: 50,
  rows: 30,
  cellSize: 10,
  speed: 100,
  cycles: 0,
};

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  createReducer(INITIAL_STATE),
  applyMiddleware(sagaMiddleware),
);

/* SAGA SETUP */

function initCanvas(canvas) {
  canvasNode = canvas;
  canvasNode.offscreenCanvas = document.createElement('canvas');
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
  // initial render
  yield call(renderBoard);
  while (true) {
    // repeated render
    const speed = yield select(state => state.speed);
    const result = yield race([
      call(delay, speed),
      take([PAUSE, CLEAR]),
    ]);
    if (result[1]) {
      yield take([START, SETTINGS]);
    }
    yield put(cycle());
    const hasUpdate = yield call(updateBoard);
    if (hasUpdate) {
      yield call(renderBoard);
    }
  }
}

function* createCells() {
  const { rows, cols, cellSize } = yield select(state => ({
    rows: state.rows,
    cols: state.cols,
    cellSize: state.cellSize,
  }));
  yield put(resetCycle());
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
  // update offscreen canvas sizes
  canvasNode.width = cols * cellSize;
  canvasNode.height = rows * cellSize;
  canvasNode.offscreenCanvas.width = canvasNode.width;
  canvasNode.offscreenCanvas.height = canvasNode.height;
}

function* clearCells() {
  yield put(resetCycle());
  const newBoard = board.map(row => row.map(() => 0));
  board = newBoard;
  yield call(renderBoard);
}

function* addNewCell({ payload: [x, y] }) {
  const { width, height } = canvasNode;
  const col = Math.floor(((1 / width) * x) * board[0].length);
  const row = Math.floor(((1 / height) * y) * board.length);
  const newBoard = board.slice();
  newBoard[row][col] = 2;
  board = newBoard;
  yield call(renderBoard);
}

function* mainSaga() {
  const { payload } = yield take(INIT);
  yield call(initCanvas, payload);
  yield call(createCells);
  yield fork(timer);
  yield takeEvery(SETTINGS, createCells);
  yield takeEvery(CLEAR, clearCells);
  yield takeEvery(CELL, addNewCell);
}

sagaMiddleware.run(mainSaga);

/* REACT-ICONS */

const Heart = () => (
  <svg
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 40 40"
    preserveAspectRatio="xMidYMid meet"
  >
    <g>
      <path
        d="m20 33.8c15.6-12.3 15-16.7 15-20s-2.8-7.5-7.5-7.5-7.5 5-7.5 5-2.8-5-7.5-5-7.5 4.1-7.5 7.5-0.6 7.7 15 20z"
      />
    </g>
  </svg>
);

const Github = () => (
  <svg
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 40 40"
    preserveAspectRatio="xMidYMid meet"
  >
    <g>
      <path
        d="m20 0c-11.045 0-20 8.955-20 20 0 8.837499999999999 5.7299999999999995 16.332499999999996 13.6775 18.9775 1 0.18249999999999744 1.3650000000000002-0.4350000000000023 1.3650000000000002-0.9624999999999986 0-0.4750000000000014-0.01875000000000071-2.053750000000001-0.027499999999999858-3.7250000000000014-5.5625 1.2100000000000009-6.737500000000001-2.3575000000000017-6.737500000000001-2.3575000000000017-0.9124999999999996-2.3099999999999987-2.2200000000000006-2.9250000000000007-2.2200000000000006-2.9250000000000007-1.8175-1.2399999999999984 0.13750000000000018-1.2162499999999987 0.13750000000000018-1.2162499999999987 2.007500000000001 0.1374999999999993 3.0650000000000004 2.0599999999999987 3.0650000000000004 2.0599999999999987 1.7850000000000001 3.057500000000001 4.682499999999999 2.1750000000000007 5.8199999999999985 1.6625000000000014 0.18125000000000036-1.2899999999999991 0.6999999999999993-2.1750000000000007 1.2699999999999996-2.6724999999999994-4.440000000000001-0.504999999999999-9.11-2.2212500000000013-9.11-9.885000000000002 0-2.1849999999999987 0.7799999999999994-3.9674999999999994 2.057500000000001-5.3675-0.20374999999999943-0.5075000000000003-0.8925000000000001-2.5425000000000004 0.1974999999999998-5.295 0 0 1.6775000000000002-0.5374999999999996 5.5 2.049999999999999 1.5937499999999982-0.44374999999999964 3.3050000000000015-0.6624999999999996 5.005000000000001-0.6712500000000006 1.6999999999999993 0.007500000000000284 3.4125000000000014 0.23000000000000043 5.0075 0.6750000000000007 3.81625-2.59 5.495000000000001-2.0500000000000007 5.495000000000001-2.0500000000000007 1.09375 2.75375 0.40500000000000114 4.7875 0.1999999999999993 5.29125 1.28125 1.4000000000000004 2.0562499999999986 3.182499999999999 2.0562499999999986 5.3675000000000015 0 7.682500000000001-4.677500000000002 9.375-9.13375 9.869999999999997 0.7199999999999989 0.620000000000001 1.3575000000000017 1.8374999999999986 1.3575000000000017 3.700000000000003 0 2.674999999999997-0.02499999999999858 4.829999999999998-0.02499999999999858 5.490000000000002 0 0.5324999999999989 0.3625000000000007 1.1550000000000011 1.375 0.9600000000000009 7.943750000000001-2.6499999999999986 13.668750000000003-10.14375 13.668750000000003-18.9775 0-11.045-8.95375-20-20-20z"
      />
    </g>
  </svg>
);

/* STYLED-COMPONENTS */

const Wrapper = styled.div`
display: flex;
flex-direction: column;
> div {
  display: flex;
  flex: 1 1 auto;
}
`;

const Header = styled.div`
flex-direction: column;
align-items: center;
h1 {
  color : #e0f8f4;
  font-size: 30px;
  span {
    font-size: 18px;
    color: rgba(224, 248, 244, 0.5);
    margin-left: 10px;
    min-width: 100px;
    display: inline-block;
  }
}
`;

const Menu = styled.div`
flex-direction: row;
align-items: space-between;
`;

const Board = styled.div`
justify-content: center;
margin: 20px 0;
canvas {
  border: 1px solid #333;
}
`;

const FooterWrapper = styled.div`
display: flex;
flex-direction: column;
> div {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
`;

const Credits = styled.div`
display: flex;
flex-direction: column !important;
justify-contnt: center;
align-items: center;
margin-top: 20px;
font-size: 14px;
color: #89898a;
a, a:link, a:visited {
  color: #89898a;
  text-decoration: none;
  &: hover {
    text-decoration: underline;
  }
}
`;

const SpeedSelector = styled.div`
color: #e0f8f4;
margin: 10px;
margin-top: 20px;
font-size: 20px;
span {
  padding: 5px;
}
select {
  background: #373440;
  font-size: 20px;
  color: rgb(240,96,96);
  padding: 5px 10px;
  border: 0;
  :focus {
    outline: none;
  }
}
`;

const FooterField = styled.div`
margin: 10px;
font-size: 20px;
color: #e0f8f4;
flex: 0 0 auto;
input {
  border: 0;
  color: rgb(240,96,96);
  font-size: 20px;
  padding: 5px 10px;
  width: 40px;
  background: #373440;
  :focus {
    outline: none;
  }
}
`;

const Button = styled.button`
font-size: 24px;
border: 0;
padding: 5px 10px;
margin: 0 10px;
border: 2px solid;
:focus {
  outline: none;
}
`;

const StartButton = Button.extend`
background: ${p => p.active ? 'rgb(242, 235, 191)' : 'rgba(242, 235, 191, 0.5)'};
border-color: ${p => p.active ? 'rgb(242, 235, 191)' : 'transparent'};
${p => p.active && `
:hover {
  border-color: rgb(240, 96, 96);
}
`}
`;
const PauseButton = Button.extend`
background: ${p => p.active ? 'rgb(242, 235, 191)' : 'rgba(242, 235, 191, 0.5)'};
border-color: ${p => p.active ? 'rgb(242, 235, 191)' : 'transparent'};
${p => p.active && `
:hover {
  border-color: rgb(240, 96, 96);
}
`}
`;
const ClearButton = Button.extend`
background: rgb(240, 96, 96);
border-color: rgb(240, 96, 96);
:hover {
  border-color: rgb(242, 235, 191);
}
`;

const UpdateButton = Button.extend`
background: rgb(242, 235, 191);
border-color: rgb(242, 235, 191);
:hover {
  border-color:  rgb(240, 96, 96);
}
`;

/* COMPONENTS */

const Footer = ({
  colValue,
  rowValue,
  cellSizeValue,
  speedValue,
  updateColValue,
  updateRowValue,
  updateCellSizeValue,
  updateSpeedValue,
  handleClickButton,
}) => (
  <FooterWrapper>
    <div>
      <FooterField>
        Columns: <input value={colValue} onChange={updateColValue} />
      </FooterField>
      <FooterField>
        Rows: <input value={rowValue} onChange={updateRowValue} />
      </FooterField>
      <FooterField>
        Cell Size: <input value={cellSizeValue} onChange={updateCellSizeValue} />
      </FooterField>
      <UpdateButton onClick={handleClickButton}>
        Update
      </UpdateButton>
    </div>
    <SpeedSelector>
      <span>Speed:</span>
      <select value={speedValue} onChange={updateSpeedValue}>
        <option value="50">Lightspeed</option>
        <option value="100">Fast</option>
        <option value="250">Medium</option>
        <option value="500">Kind of slow</option>
        <option value="1000">Boring</option>
      </select>
    </SpeedSelector>
    <Credits>
      <p>Made with <Heart /></p>
      <p>
        <a
          href="https://github.com/ChrisGitter/game-of-life"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Github <Github />
        </a>
      </p>
    </Credits>
  </FooterWrapper>
);

class _FooterContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colValue: String(props.cols),
      rowValue: String(props.rows),
      cellSizeValue: String(props.cellSize),
      speedValue: String(props.speed),
    };

    this.updateColValue = this.updateColValue.bind(this);
    this.updateRowValue = this.updateRowValue.bind(this);
    this.updateCellSizeValue = this.updateCellSizeValue.bind(this);
    this.handleClickButton = this.handleClickButton.bind(this);
    this.updateSpeedValue = this.updateSpeedValue.bind(this);
  }

  updateColValue(e) {
    const colValue = e.target.value;
    if (inputRegex.test(colValue)) {
      this.setState(state => ({
        ...state,
        colValue,
      }));
    }
  }

  updateRowValue(e) {
    const rowValue = e.target.value;
    if (inputRegex.test(rowValue)) {
      this.setState(state => ({
        ...state,
        rowValue,
      }));
    }
  }

  updateCellSizeValue(e) {
    const cellSizeValue = e.target.value;
    if (inputRegex.test(cellSizeValue)) {
      this.setState(state => ({
        ...state,
        cellSizeValue,
      }));
    }
  }

  updateSpeedValue(e) {
    const speedValue = e.target.value;
    if (speedRegex.test(speedValue)) {
      this.setState(state => ({
        ...state,
        speedValue,
      }), () => {
        this.props.setSpeed(+speedValue);
      });
    }
  }

  handleClickButton() {
    const { colValue, rowValue, cellSizeValue } = this.state;
    this.props.settings({
      cols: +colValue,
      rows: +rowValue,
      cellSize: +cellSizeValue,
    });
  }

  render() {
    return (
      <Footer
        updateColValue={this.updateColValue}
        updateRowValue={this.updateRowValue}
        updateCellSizeValue={this.updateCellSizeValue}
        handleClickButton={this.handleClickButton}
        updateSpeedValue={this.updateSpeedValue}
        {...this.state}
      />
    );
  }
}
const FooterContainer = connect(state => ({
  cols: state.cols,
  rows: state.rows,
  cellSize: state.cellSize,
  speed: state.speed,
}), dispatch => bindActionCreators(
  {
    settings,
    setSpeed,
  },
  dispatch,
))(_FooterContainer);

const App = ({
  active,
  setRef,
  cycles,
  handleClickStart,
  handleClickPause,
  handleClickClear,
  handleClickCanvas,
}) => (
  <Wrapper>
    <Header>
      <h1>
        {"Conway's Game of Life"}
        <span>
          {cycles} cycles
        </span>
      </h1>
      <Menu>
        <StartButton
          onClick={handleClickStart}
          active={!active}
        >
          Start
        </StartButton>
        <PauseButton
          onClick={handleClickPause}
          active={active}
        >
          Pause
        </PauseButton>
        <ClearButton
          onClick={handleClickClear}
        >
          Clear
        </ClearButton>
      </Menu>
    </Header>
    <Board>
      <canvas
        ref={setRef}
        onClick={handleClickCanvas}
      />
    </Board>
    <FooterContainer />
  </Wrapper>
);


class _AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.init = false;

    this.setRef = this.setRef.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
    this.handleClickPause = this.handleClickPause.bind(this);
    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleClickCanvas = this.handleClickCanvas.bind(this);
  }

  setRef(elem) {
    if (!this.init && elem) {
      this.props.init(elem);
      this.init = true;
    }
  }

  handleClickStart() {
    this.props.start();
  }

  handleClickPause() {
    this.props.pause();
  }

  handleClickClear() {
    this.props.clear();
  }

  handleClickCanvas(e) {
    const { offsetTop, offsetLeft } = e.target;
    const { pageX, pageY } = e;
    const clickX = pageX - offsetLeft;
    const clickY = pageY - offsetTop;
    this.props.addCell([clickX, clickY]);
  }

  render() {
    return (
      <App
        active={this.props.active}
        setRef={this.setRef}
        cycles={this.props.cycles}
        handleClickStart={this.handleClickStart}
        handleClickPause={this.handleClickPause}
        handleClickClear={this.handleClickClear}
        handleClickCanvas={this.handleClickCanvas}
      />
    );
  }
}

const AppContainer = connect(
  state => ({
    active: state.active,
    cycles: state.cycles,
  }),
  dispatch => bindActionCreators({
    start,
    pause,
    clear,
    init,
    addCell,
  }, dispatch),
)(_AppContainer);

/* RENDER APP */

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>
  , document.getElementById('root'),
);
