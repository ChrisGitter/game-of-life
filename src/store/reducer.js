import { handleActions } from 'redux-actions';
import * as actions from './actions';

const createReducer = defaultState => handleActions(
  {
    [actions.START]: state => ({
      ...state,
      active: true,
    }),
    [actions.PAUSE]: state => ({
      ...state,
      active: false,
    }),
    [actions.CLEAR]: state => ({
      ...state,
      active: false,
      board: null,
    }),
    [actions.SETTINGS]: (state, { payload: { cols, rows, cellSize } }) => ({
      ...state,
      cols,
      rows,
      cellSize,
      active: true,
    }),
    [actions.SPEED]: (state, { payload }) => ({
      ...state,
      speed: payload,
    }),
    [actions.CYCLE]: state => ({
      ...state,
      cycles: state.cycles + 1,
    }),
    [actions.RESET_CYCLE]: state => ({
      ...state,
      cycles: 0,
    }),
  },
  defaultState,
);

export default createReducer;
