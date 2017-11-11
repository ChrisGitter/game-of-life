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
  },
  defaultState,
);

export default createReducer;
