import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';
import app from './features/app';
import * as actions from './features/data/actions';

/* Initial actions, including setting the logged in user and getting all events */
store.dispatch(actions.initialized());

/* Declare all compnents */
const {
  App,
  HomeContainer,
  AdminContainer,
  EditParticipantContainer,
  EditRegistrationContainer } = app.components;

/* Define routes for administrators */
const adminUserRoutes = () => (
  <Route path="/" component={App} >
    <IndexRoute component={HomeContainer} />
    <Route path="/admin" component={AdminContainer} />
    <Route path="/admin/editparticipant/:id" component={EditParticipantContainer} />
    <Route path="/editregistration/:id" component={EditRegistrationContainer} />
  </Route>
);
/* End Administrator Routes */


/* Render application using react router */
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      {adminUserRoutes()}
    </Router>
  </Provider>,
    document.getElementById('app')
  );
