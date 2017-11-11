import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducer';
import mainSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const INITIAL_STATE = {
  active: true,
  cols: 50,
  rows: 30,
  cellSize: 10,
  speed: 100,
  cycles: 0,
};

const actionSanitizer = action => (
  action.type === 'INIT' && action.payload
    ? { ...action, payload: '<<CANVAS>>' }
    : action
);

const options = {
  actionSanitizer,
  actionsBlacklist: ['CYCLE'],
};

const composeEnhancers =
typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(options)
  : compose;

const store = createStore(
  createReducer(INITIAL_STATE),
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(mainSaga);

export default store;
