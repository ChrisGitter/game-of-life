import { handleActions } from 'redux-actions';
import * as actions from './actions';

const createReducer = defaultState => handleActions({
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
    [actions.SET_BOARD]: (state, { payload }) => ({
      ...state,
      board: payload,
    }),
    [actions.INIT]: (state, { payload }) => ({
      ...state,
      canvas: payload,
    }),
  },
  defaultState,
);

export default createReducer;
