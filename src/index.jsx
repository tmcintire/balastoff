import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
  EditRegistrationContainer,
  CompRegistrationsContainer,
  AddParticipantContainer,
  LevelCheckContainer,
  LevelCheckUpdatesContainer,
  LevelCheckDashboardContainer,
  MissedLevelCheckContainer,
  MissionGearIssuesContainer,
  Instructions,
  MoneyLogContainer,
  MasterAdminContainer,
  EditTracks,
  EditPasses,
  EditDances,
  EditConfig,
  EditStore,
  EditAdminFields,
  StoreContainer,
  CompsTablesContainer,
  DashboardContainer,
  RegCommentsContainer } = app.components;

/* Define routes for administrators */
const adminUserRoutes = () => (
  <Route path="/" component={App} >
    <IndexRoute component={HomeContainer} />
    <Route path="/admin" component={AdminContainer} />
    <Route path="/admin/editparticipant/:id" component={EditParticipantContainer} />
    <Route path="/addparticipant" component={AddParticipantContainer} />
    <Route path="/admin/levelcheck" component={LevelCheckContainer} />
    <Route path="/admin/levelcheckupdates" component={LevelCheckUpdatesContainer} />
    <Route path="/admin/moneylog" component={MoneyLogContainer} />
    <Route path="/admin/levelcheckdashboard" component={LevelCheckDashboardContainer} />
    <Route path="/admin/missedlevelcheck" component={MissedLevelCheckContainer} />
    <Route path="/admin/compstables" component={CompsTablesContainer} />
    <Route path="/admin/comments" component={RegCommentsContainer} />
    <Route path="/editregistration/:id" component={EditRegistrationContainer} />
    <Route path="/comps" component={CompRegistrationsContainer} />
    <Route path="/admin/missiongearissues" component={MissionGearIssuesContainer} />
    <Route path="/instructions" component={Instructions} />
    <Route path="/dashboard" component={DashboardContainer} />
    <Route path="administrator" component={MasterAdminContainer} >
      <IndexRoute component={EditTracks} />
      <Route path="edittracks" component={EditTracks} />
      <Route path="editpasses" component={EditPasses} />
      <Route path="editdances" component={EditDances} />
      <Route path="editconfig" component={EditConfig} />
      <Route path="editstore" component={EditStore} />
      <Route path="editadminfields" component={EditAdminFields} />
    </Route >
    <Route path="store" component={StoreContainer} />
  </Route>
);
/* End Administrator Routes */


/* Render application using react router */
ReactDOM.render(
  <Provider compiler="TypeScript" framework="React" store={store}>
    <Router history={hashHistory}>
      {adminUserRoutes()}
    </Router>
  </Provider>,
    document.getElementById('app')
  );
