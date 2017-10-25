require('./polyfills');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import createDispatcher from './lib/dispatcher';
import Context from './context';

// Domains
import * as Count from './domains/count';
import * as Name from './domains/name';

// Components
import App from './containers/App';

// Hook up reducers and handlers for each domain
const initContext = () => {
  Context.store = createStore(combineReducers({
    count: Count.reducer,
    name: Name.reducer
  }));

  Context.dispatcher = createDispatcher({
    ...Count.handlers,
    ...Name.handlers
  });
};

const initRender = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
};

// TODO: Don't init if testing
initContext();
initRender();