import { createStore, combineReducers } from 'redux';
import { hogeReducer, HogeState } from './states/hogeState';

export type AppState = {
  hoge: HogeState
};

const store = createStore(
  combineReducers<AppState>({
    hoge: hogeReducer
  })
);

export default store;