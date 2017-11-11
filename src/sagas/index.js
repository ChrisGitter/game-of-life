import { all, call } from 'redux-saga/effects';
import board from './board';

function* main() {
  yield all([
    call(board),
  ]);
}

export default main;
