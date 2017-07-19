import { applyMiddleware, createStore, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducer';

const loggerMiddleware = createLogger({
  colors: {},
  collapsed: () => true,
});


const middleware = applyMiddleware(
  loggerMiddleware,
  thunk,
);

const store = createStore(
  reducer,
  compose(
    middleware,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
);

export default store;
