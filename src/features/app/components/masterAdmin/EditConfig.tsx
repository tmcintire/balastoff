import * as React from 'react';
import * as _ from 'lodash';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { IConfig } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface EditConfigProps {
  config: IConfig
}

interface EditConfigState {
  loading: boolean,
  showForm: boolean,
  isEditing: boolean,
  editedObject: IConfig,
  editedIndex: string,
  showSaved: boolean,
}

export class EditConfig extends React.Component<EditConfigProps, EditConfigState> {
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
    if (this.props.config) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.config) {
      this.setState({
        loading: false,
      });
    }
  }

  addEdit = (key: string, addEdit) => {
    this.setState({
      showForm: true,
      isEditing: addEdit,
      editedIndex: key,
      editedObject: addEdit ? this.props.config : {},
    });
  }

  handleChange = (e) => {
    const target = e.target.name;
    let value = e.target.value;
    if (e.target.value === 'true') {
      value = true;
    } else if (e.target.value === 'false') {
      value = false;
    }

    this.setState({
      editedObject: {
        [target]: value,
      },
    });
  }

  saveChanges = (e) => {
    e.preventDefault();
    const configKey = this.state.editedIndex;
    api.updateConfig({ [configKey]: this.state.editedObject[configKey] });
    this.saved();
    this.setState({ showForm: false });
  }

  delete = (e) => {
    e.preventDefault();
    api.deleteRef('config', this.state.editedIndex);
    this.setState({ showForm: false });
  }

  cancel = (e) => {
    e.preventDefault();
    this.setState({ showForm: false });
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
    const renderConfig = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return Object.keys(this.props.config).map((key) => (
        <tr key={key} onClick={() => this.addEdit(key, true)}>
          <td>{key}</td>
          <td>{`${this.props.config[key]}`}</td>
        </tr>

      ));
    };

    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);

    const renderForm = () => {
      if (this.state.showForm) {
        return (
          <div>
            <h1 className="text-center">{this.state.isEditing ? 'Edit Configuration' : 'Add Configuration'}</h1>
            {this.state.isEditing ? <button className="btn btn-danger" onClick={e => this.delete(e)}>Delete Config</button> : ''}
            <div className="form-group">
              <form>
                <label htmlFor="type">Config</label>
                <input className="form-control" name="config" defaultValue={this.state.isEditing ? this.state.editedIndex : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Value</label>
                <input className="form-control" name={this.state.editedIndex} defaultValue={this.state.isEditing ? this.state.editedObject[this.state.editedIndex] : ''} onChange={this.handleChange} type="text" />
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
        <h1 className="text-center">Configuration Parameters</h1>
        {renderSaved()}
        <table className="table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {renderConfig()}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={() => this.addEdit(null, false)}>Add New Configuration</button>
        {renderForm()}
      </div>
    );
  }
}
