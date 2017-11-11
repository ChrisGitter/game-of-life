import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducer';
import mainSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const INITIAL_STATE = {
  active: false,
  sizeX: 100,
  sizeY: 70,
  speed: 100,
  board: null,
  canvas: null,
};

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  createReducer(INITIAL_STATE),
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(mainSaga);

export default store;
