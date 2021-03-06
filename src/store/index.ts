import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { rootReducer } from '../reducers';
import rootSaga from '../sagas'

export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    applyMiddleware(logger, sagaMiddleware),
  );

  sagaMiddleware.run(rootSaga);

  return store;
};