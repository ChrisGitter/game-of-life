import { createAction } from 'redux-actions';

export const START = 'START';
export const PAUSE = 'STOP';
export const CLEAR = 'CLEAR';
export const INIT = 'INIT';
export const SETTINGS = 'SETTINGS';
export const SPEED = 'SPEED';
export const CELL = 'CELL';
export const CYCLE = 'CYCLE';
export const RESET_CYCLE = 'RESET_CYCLE';

export const start = createAction(START);
export const pause = createAction(PAUSE);
export const clear = createAction(CLEAR);
export const init = createAction(INIT);
export const settings = createAction(SETTINGS);
export const setSpeed = createAction(SPEED);
export const addCell = createAction(CELL);
export const cycle = createAction(CYCLE);
export const resetCycle = createAction(RESET_CYCLE);
