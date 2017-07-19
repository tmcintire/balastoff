import { applyMiddleware, createStore, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducer';
import saga from '../features/data/saga';
//
const loggerMiddleware = createLogger({
  colors: {},
  collapsed: () => true,
});

const sagaMiddleware = createSagaMiddleware();

const middleware = applyMiddleware(
  loggerMiddleware,
  thunk,
  sagaMiddleware
);

const store = createStore(
  reducer,
  compose(
    middleware,
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

sagaMiddleware.run(saga);

export default store;
