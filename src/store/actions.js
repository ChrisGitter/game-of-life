import { createAction } from 'redux-actions';

export const START = 'START';
export const PAUSE = 'STOP';
export const CLEAR = 'CLEAR';
export const INIT = 'INIT';

export const start = createAction(START);
export const pause = createAction(PAUSE);
export const clear = createAction(CLEAR);
export const init = createAction(INIT);
