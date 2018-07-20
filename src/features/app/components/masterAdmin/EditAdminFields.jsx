import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const newSortOrder = endIndex + 1;
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  const newList = result.map((r, index) => {
    return {
      ...r,
      sortOrder: index + 1,
    };
  });

  return newList;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: 'white',
  padding: grid,
});

export class EditAdminFields extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.fields) {
      return {
        loading: false,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showForm: false,
      isEditing: false,
      editedObject: {},
      editedKey: null,
      showSaved: false,
      options: null,
      sortedFields: [],
    };
  }

  addEdit = (key, addEdit) => {
    let options = [];
    if (key && this.props.fields[key].options && this.props.fields[key].options.length > 0) {
      options = this.props.fields[key].options;
    }

    this.setState({
      showForm: true,
      isEditing: addEdit,
      editedKey: key,
      editedObject: addEdit ? this.props.fields[key] : {},
      options,
    });
  }

  handleChange = (e) => {
    const key = e.target.name;
    let value = e.target.value;
    if (key === 'sortOrder') {
      value = parseInt(value, 10);
    }
    this.setState({
      editedObject: {
        ...this.state.editedObject,
        [key]: value,
      },
    });
  }

  handleOptionChange = (e, index, key) => {
    const target = e.target.name;
    let option = {};
    if (!this.state.editedObject.options) {
      // if the edited object does not have options already on it
      option = { [key]: e.target.value };
    } else if (this.state.editedObject.options[index]) {
      option = {
        ...this.state.editedObject.options[index],
        [key]: e.target.value,
      };
    }

    this.setState({
      editedObject: {
        ...this.state.editedObject,
        options: {
          ...this.state.editedObject.options,
          [index]: option,
        },
      },
    });
  }

  saveChanges = (e) => {
    e.preventDefault();
    const isUpdate = this.state.isEditing;
    api.update('Fields', this.state.editedKey, this.state.editedObject, isUpdate);
    this.saved();
    this.setState({ showForm: false });
  }

  delete = (e) => {
    e.preventDefault();
    api.deleteRef('Fields', this.state.editedKey);
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

  addOption = () => {
    this.setState({
      options: this.state.options.concat({ key: '', label: '' }),
    });
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sortedFields = reorder(
      this.props.fields,
      result.source.index,
      result.destination.index
    );

    api.updateFields(sortedFields);
  }

  render() {
    const renderOptions = (options) => {
      return options.map(option => {
        return <div>{option.label}</div>;
      });
    };

    const renderFields = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }

      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <tbody
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {Object.keys(this.props.fields).map((key, index) => {
                  const field = this.props.fields[key];
                  
                  return (
                    <Draggable key={field.key} draggableId={field.key} index={index}>
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => this.addEdit(key, true)}
                        >
                          <td>{field.key}</td>
                          <td>{field.label}</td>
                          <td>{field.sortOrder}</td>
                          <td>{field.type}</td>
                          <td>{field.options && renderOptions(field.options)}</td>
                        </tr>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
      );
    };

    const renderOptionsInput = () => {
      return this.state.options.map((option, index) => {
        return (
          <div className="flex-row">
            <input className="form-control" type="text" name="label" defaultValue={option.label} onChange={(e) => this.handleOptionChange(e, index, 'label')} />
            <input className="form-control" type="text" name="value" defaultValue={option.value} onChange={(e) => this.handleOptionChange(e, index, 'value')} />
          </div>
        );
      });
    };

    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);

    const renderForm = () => {
      if (this.state.showForm) {
        let sortOrders = this.props.fields.map(f => {
          return f.sortOrder;
        });
        const sortOrderValue = this.state.isEditing ? this.props.fields[this.state.editedKey] : _.last(sortOrders) + 1;

        return (
          <div>
            <h1 className="text-center">{this.state.isEditing ? 'Edit Configuration' : 'Add Configuration'}</h1>
            {this.state.isEditing ? <button className="btn btn-danger" onClick={e => this.delete(e)}>Delete Config</button> : ''}
            <div className="form-group">
              <form>
                <label htmlFor="type">Key</label>
                <input className="form-control" name="key" defaultValue={this.state.isEditing ? this.props.fields[this.state.editedKey].key : ''} onChange={this.handleChange} type="text" />
                <label htmlFor="type">Label</label>
                <input className="form-control" name="label" defaultValue={this.state.isEditing ? this.props.fields[this.state.editedKey].label : ''} onChange={this.handleChange} type="text" />
                
                <label htmlFor="type">Sort Order</label>
                <input className="form-control" type="number" name="sortOrder" defaultValue={sortOrderValue} onChange={this.handleChange} />

                <label htmlFor="type">Type</label>
                <input className="form-control" name="type" defaultValue={this.state.isEditing ? this.props.fields[this.state.editedKey].type : ''} onChange={this.handleChange} type="text" />
                
                <label htmlFor="type">Options</label>
                {renderOptionsInput()}
                <i className="fa fa-plus" onClick={this.addOption} />
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
        <h1 className="text-center">Editable Participant Fields</h1>
        {renderSaved()}
        <table className="table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Label</th>
              <th>Sort</th>
              <th>Type</th>
              <th>Options</th>
            </tr>
          </thead>
          {renderFields()}
        </table>
        <button className="btn btn-primary" onClick={() => this.addEdit(null, false)}>Add New Configuration</button>
        {renderForm()}
      </div>
    );
  }
}
