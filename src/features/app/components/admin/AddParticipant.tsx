import * as React from 'react';
import { Link } from 'react-router';
import * as _ from 'lodash';
import * as api from '../../../data/api';
import * as helpers from '../../../data/helpers';
import { IAdminMissionPasses, Registration, IRegistration, ILevels, } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface AddParticipantProps {
  tracks: ILevels[],
  passes: IAdminMissionPasses[],
  tracksLoading: boolean,
  passesLoading: boolean
}

interface AddParticipantState {
  bookingId: number,
  firstName: string,
  lastName: string,
  leadFollow: string,
  price: number,
  pass: IAdminMissionPasses,
  level: string,
  displayMessage: false,
  errors: {
    firstName: boolean,
    lastName: boolean,
    leadFollow: boolean,
    price: boolean,
    pass: boolean,
    email: boolean,
    level: boolean
  },
  email: string,
  hasErrors: boolean,
  hasPaid: boolean
}

export class AddParticipant extends React.Component<AddParticipantProps, AddParticipantState> {
  constructor(props) {
    super(props);

    this.state = {
      bookingId: api.getLastBookingId() + 1,
      firstName: '',
      lastName: '',
      leadFollow: '',
      price: 0,
      pass: null,
      level: '',
      displayMessage: false,
      errors: {
        firstName: false,
        lastName: false,
        leadFollow: false,
        price: false,
        pass: false,
        email: false,
        level: false
      },
      email: '',
      hasErrors: false,
      hasPaid: false
    };
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.prices) {
    //   const price = this.lookupPrice(this.state.level, nextProps.prices);

    //   this.setState({
    //     price,
    //   });
    // }
    if (nextProps.registrations) {
      this.setState({
        bookingId: api.getLastBookingId() + 1,
      });
    }
  }

  validate = (firstName, lastName, leadFollow, price, pass, hasPaid, level, email) => {
    // true means invalid, so our conditions got reversed
    return {
      firstName: firstName.length === 0,
      lastName: lastName.length === 0,
      leadFollow: leadFollow.length === 0,
      price: price.length === 0,
      pass: pass.length === 0,
      hasPaid: hasPaid === true,
      level: level === null || level === '',
      email: email === '' || email === null
    };
  }

  addParticipant = (e, id) => {
    e.preventDefault();
    const errors = this.validate(
      this.state.firstName,
      this.state.lastName,
      this.state.leadFollow,
      this.state.price,
      this.state.pass,
      this.state.hasPaid,
      this.state.level,
      this.state.email);

    this.setState({ errors, hasErrors: false }); // set state as false for now

    if (_.some(errors, err => err === true)) {
      this.setState({ hasErrors: true });
      return;
    }

    const registration = new Registration(); 
    registration.FirstName = this.state.firstName,
    registration.BookingID = this.state.bookingId,
    registration.LastName = this.state.lastName,
    registration.Level = this.state.level || 'NA',
    registration.HasLevelCheck = helpers.hasLevelCheck(this.state.level, this.props.tracks),
    registration.LevelChecked = false,
    registration.LevelUpdated = false,
    registration.BadgeUpdated = false,
    registration.Email = this.state.email,
    registration.MissedLevelCheck = false,
    registration.OriginalLevel = this.state.level || 'NA',
    registration.HasPaid = false,
    registration.LeadFollow = this.state.leadFollow,
    registration.Open = false,
    registration.AdNov = false,
    registration.AmountOwed = this.state.hasPaid ? 0 : this.state.price,
    registration.OriginalAmountOwed = this.state.price,
    registration.CheckedIn = false,
    registration.WalkIn = true,

    api.addRegistration(id, registration);
    window.location.href = `#/editregistration/${id}`;
  }

  createSelectPassItems() {
    let items = [];
    let passesArray = Object.keys(this.props.passes).map(key => this.props.passes[key]);    
    let passes = helpers.sortTracks(passesArray);    
    _.forIn(passes, (p, index) => {
      items.push(<option key={index} value={p.name}>{p.name}</option>);
    });
    return items;
  }

  createSelectLevelItems() {
    let items = [];
    let tracksArray = Object.keys(this.props.tracks).map(key => this.props.tracks[key]);
    let tracks = helpers.sortTracks(tracksArray);    
    _.forIn(tracks, (t, index) => {
      items.push(<option key={index} value={t.name}>{t.name}</option>);
    });
    return items;
  }

  handleChange = (e) => {
    let pass: IAdminMissionPasses;
    let level;
    const name = e.target.name;
    switch (name) {
      case 'pass':
        pass = _.filter(this.props.passes, p => p.name === e.target.value)[0];
        this.setState({
          [name]: pass,
          price: pass.price
        } as Pick<AddParticipantState, keyof AddParticipantState>);
        break;
      case 'level':
        level = _.filter(this.props.tracks, t => t.name === e.target.value)[0];
        this.setState({ [name]: level.name } as Pick<AddParticipantState, keyof AddParticipantState>);
        break;
      case 'hasPaid':
        this.setState({ [name]: e.target.checked } as Pick<AddParticipantState, keyof AddParticipantState>);
        break;
      default:
        this.setState({ [name]: e.target.value } as Pick<AddParticipantState, keyof AddParticipantState>);
        break;
    }

    if (this.state.hasErrors) {
      const errors = this.validate(
        this.state.firstName,
        this.state.lastName,
        this.state.leadFollow,
        this.state.price,
        this.state.pass,
        this.state.hasPaid,
        this.state.level,
        this.state.email);

      if (errors) {
        this.setState({
          hasErrors: true,
          errors,
        });
        return;
      }
    }
  }

  handleCancel = (e) => {
    e.preventDefault();

    window.location.href = '#/';
  }
  render() {
    const  { displayMessage } = this.state;

    const renderErrorMessage = this.state.hasErrors ? (<h4 className="error-message">Plese check the form for errors</h4>) : '';

    const renderForm = () => {
      if (this.props.tracksLoading === false && this.props.passesLoading === false) {
        const id = this.state.bookingId;
        return (
          <div>
            <div className="form-container">
              <Link to={'/'}><button className="btn btn-primary custom-buttons">Back to Participants</button></Link>
              <h1 className="text-center">Add Participant</h1>
              <div className="form-group">
                <form>
                  <label htmlFor="type">BookingID</label>
                  <input disabled className="form-control" type="text" value={id} onChange={this.handleChange} autoFocus />
                  <label htmlFor="type">First</label>
                  <input name="firstName" onChange={this.handleChange} className={`form-control ${this.state.errors.firstName ? 'error' : ''}`} type="text" />
                  <label htmlFor="type">Last</label>
                  <input name="lastName" onChange={this.handleChange} className={`form-control ${this.state.errors.lastName ? 'error' : ''}`} type="text" />
                  <label htmlFor="type">Email</label>
                  <input name="email" onChange={this.handleChange} className={`form-control ${this.state.errors.email ? 'error' : ''}`} type="text" />
                  <label htmlFor="type">Lead/Follow</label>
                  <select name="leadFollow" onChange={this.handleChange} className={`form-control ${this.state.errors.leadFollow ? 'error' : ''}`} >
                    <option value="" />
                    <option value="Lead">Lead</option>
                    <option value="Follow">Follow</option>
                  </select>
                  <label htmlFor="type">Pass</label>
                  <select name="pass" onChange={this.handleChange} className={`form-control ${this.state.errors.pass ? 'error' : ''}`} >
                    <option value="" />
                    {this.createSelectPassItems()}
                  </select>
                  <label htmlFor="type">Level</label>
                  <select name="level" onChange={this.handleChange} className={`form-control ${this.state.errors.level ? 'error' : ''}`} >
                    <option value="" />
                    {this.createSelectLevelItems()}
                  </select>

                  <label htmlFor="type">Price</label>
                  <input onChange={this.handleChange} name="price" className={`form-control ${this.state.errors.price ? 'error' : ''}`} type="text" value={this.state.price} />

                  {renderErrorMessage}
                  <div className="form-submit-buttons flex-row flex-justify-space-between">
                    <button onClick={e => this.handleCancel(e)} className="btn btn-danger custom-buttons">Cancel</button>
                    <button onClick={e => this.addParticipant(e, id)} className="btn btn-success custom-buttons">Add</button>
                  </div>

                  <br />
                </form>
              </div>
            </div>
          </div>
        );
      }
      return (
        <Loading />
      );
    };
    return (
      <div className="container form-container">
        {renderForm()}
      </div>
    );
  }
}
