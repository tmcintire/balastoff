import * as React from 'react';
import * as _ from 'lodash';
import * as api from '../../../data/api';
import { IStore } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface EditStoreProps {
  store: IStore
}

interface EditStoreState {
  loading: boolean,
  showForm: boolean,
  isEditing: boolean,
  editedObject: IStore,
  editedIndex: string,
  showSaved: boolean,
}

export class EditStore extends React.Component<EditStoreProps, EditStoreState> {
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
    if (this.props.store) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.store) {
      this.setState({
        loading: false,
      });
    }
  }

  addEdit = (index, addEdit) => {

    let obj: IStore = {
      name: '',
      quantity: 0,
      price: 0
    };

    this.setState({
      showForm: true,
      isEditing: addEdit,
      editedIndex: index,
      editedObject: addEdit ? this.props.store[index] : obj,
    });
  }

  handleChange = (e) => {
    const target = e.target.name;

    let value = e.target.value;

    if (target === 'price') {
      value = parseInt(value, 10);
    } else if (target === 'quantity') {
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
    const editedObject = this.state.editedObject;
    if (!isUpdate) {
      editedObject.quantity = 0;
    }
    api.update('Store', this.state.editedIndex, editedObject, isUpdate);
    this.saved();
    this.setState({ showForm: false });
  }

  delete = (e) => {
    e.preventDefault();
    api.deleteRef('Store', this.state.editedIndex);
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
    const renderStore = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return Object.keys(this.props.store).map((key) => {
        const item = this.props.store[key];
        return (
          <tr key={key} onClick={() => this.addEdit(key, true)}>
            <td>{item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>{item.quantity}</td>
          </tr>
        );
      });
    };

    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);

    const renderForm = () => {
      if (this.state.showForm && this.state.editedObject) {
        return (
          <div>
            <h1 className="text-center">{this.state.isEditing ? 'Edit Store Item' : 'Add Store Item'}</h1>
            {this.state.isEditing ? <button className="btn btn-danger" onClick={e => this.delete(e)}>Delete Dance</button> : ''}
            <div className="form-group">
              <form>
                <label htmlFor="type">Name</label>
                <input className="form-control" name="name" defaultValue={this.state.isEditing ? this.state.editedObject.name : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Price</label>
                <input className="form-control" name="price" defaultValue={this.state.isEditing ? this.state.editedObject.price.toString() : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Amount Sold</label>
                <input className="form-control" name="quantity" defaultValue={this.state.isEditing ? this.state.editedObject.quantity.toString() : ''} onChange={this.handleChange} type="text" />
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
        <h1 className="text-center">Store Items</h1>
        {renderSaved()}
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Amount Sold</th>
            </tr>
          </thead>
          <tbody>
            {renderStore()}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={() => this.addEdit(null, false)}>Add New Item</button>
        {renderForm()}
      </div>
    );
  }
}
