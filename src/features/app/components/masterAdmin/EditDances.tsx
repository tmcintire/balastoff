import * as React from 'react';
import * as _ from 'lodash';
//import Datetime from 'react-datetime';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { IDance } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface EditDancesProps {
  dances: IDance
}

interface EditDancesState {
  loading: boolean,
  showForm: boolean,
  isEditing: boolean,
  editedObject: IDance,
  editedIndex: string,
  showSaved: boolean,
}

export class EditDances extends React.Component<EditDancesProps, EditDancesState> {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showForm: false,
      isEditing: false,
      editedObject: null,
      editedIndex: null,
      showSaved: false,
    };
  }

  componentWillMount() {
    if (this.props.dances) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dances) {
      this.setState({
        loading: false,
      });
    }
  }

  addEdit = (index, addEdit) => {
    this.setState({
      showForm: true,
      isEditing: addEdit,
      editedIndex: index,
      editedObject: addEdit ? this.props.dances[index] : {},
    });
  }

  handleChange = (e) => {
    const target = e.target.name;
    let value = e.target.value;

    if (target === 'price') {
      value = parseInt(value, 10);
    }

    if (target === 'count') {
      value = parseInt(value, 10);
    }

    this.setState({
      editedObject: {
        ...this.state.editedObject,
        [target]: value,
      },
    });
  }

  saveChanges = (e) => {
    e.preventDefault();
    const isUpdate = this.state.isEditing;
    api.update('Dances', this.state.editedIndex, this.state.editedObject, isUpdate);
    this.saved();
    this.setState({ showForm: false });
  }

  delete = (e) => {
    e.preventDefault();
    api.deleteRef('Dances', this.state.editedIndex);
    this.setState({ showForm: false });
  }

  cancel = (e) => {
    e.preventDefault();
    this.setState({ showForm: false });
  }

  handleStartDateChange = (selectedDate) => {
    this.setState({
      editedObject: {
        ...this.state.editedObject,
        startDate: selectedDate.format('MM/DD/YYYY h:mm A'),
      },
    });
  }

  handleEndDateChange = (selectedDate) => {
    this.setState({
      editedObject: {
        ...this.state.editedObject,
        endDate: selectedDate.format('MM/DD/YYYY h:mm A'),
      },
    });
  }

  saved = () => {
    this.setState({
      showSaved: true,
    });
    setTimeout(() => {
      this.setState({
        showSaved: false,
      });
    }, 2000);
  }
  render() {
    const renderDances = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return Object.keys(this.props.dances).map((key, index) => {
        const dance = this.props.dances[key];
        return (
          <tr key={index} onClick={() => this.addEdit(key, true)}>
            <td>{dance.key}</td>
            <td>{dance.name}</td>
            <td>{dance.price}</td>
            <td>{dance.startDate}</td>
            <td>{dance.endDate}</td>
            <td>{dance.count}</td>
          </tr>
        );
      });
    };

    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);

    const renderForm = () => {
      if (this.state.showForm) {
        return (
          <div>
            <h1 className="text-center">{this.state.isEditing ? 'Edit Dance' : 'Add Dance'}</h1>
            {this.state.isEditing ? <button className="btn btn-danger" onClick={e => this.delete(e)}>Delete Dance</button> : ''}
            <div className="form-group">
              <form>
                <label htmlFor="type">Key</label>
                <input className="form-control" name="key" defaultValue={this.state.isEditing ? this.state.editedObject.key : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Name</label>
                <input className="form-control" name="name" defaultValue={this.state.isEditing ? this.state.editedObject.name : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Price</label>
                <input className="form-control" name="price" defaultValue={this.state.isEditing ? this.state.editedObject.price.toString() : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Start</label>
                {/*<Datetime
                  defaultValue={this.state.editedObject.startDate}
                  id="date-picker"
                  onChange={e => this.handleStartDateChange(e)}
                />
                <label htmlFor="type">End</label>
                <Datetime
                  defaultValue={this.state.editedObject.endDate}
                  id="date-picker"
                  onChange={e => this.handleEndDateChange(e)}
                /> */}
                <label htmlFor="type">Count</label>
                <input className="form-control" name="count" defaultValue={this.state.isEditing ? this.state.editedObject.count.toString() : ''} onChange={this.handleChange} type="number" />
                <br />

                <div className="form-submit-buttons flex-row flex-justify-space-between">
                  <button onClick={e => this.cancel(e)} className="btn btn-danger custom-buttons">Cancel</button>
                  <button onClick={e => this.saveChanges(e)} className="btn btn-success custom-buttons">
                    {this.state.isEditing ? 'Save' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      }
      return true;
    };

    return (
      <div className="container">
        <h1 className="text-center">Dances</h1>
        {renderSaved()}
        <table className="table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Name</th>
              <th>Price</th>
              <th>Start</th>
              <th>End</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {renderDances()}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={() => this.addEdit(null, false)}>Add New Dance</button>
        {renderForm()}
      </div>
    );
  }
}
