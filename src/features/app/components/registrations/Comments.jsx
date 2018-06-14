import React from 'react';
import PropTypes from 'prop-types';
import * as api from '../../../data/api';

export class Comments extends React.Component {
  constructor() {
    super();

    this.state = {
      comment: null,
    };
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleSubmitComment();
    }
  }

  handleSubmitComment = () => {
    let object = {};
    if (this.props.registration.Comments) {
      object = {
        Comments: [...this.props.registration.Comments, this.state.comment],
      };
    } else {
      object = {
        Comments: [this.state.comment],
      };
    }

    api.updateRegistration(this.props.id, object);
    this.setState({
      comment: null,
    });
    this.comment.value = null;
    this.props.saved();
  }
  handleChange = (e) => {
    this.setState({
      comment: e.target.value,
    });
  }
  render() {
    const renderComments = () => {
      if (this.props.registration.Comments) {
        return this.props.registration.Comments.map((comment, index) => {
          return (
            <li key={index}>{comment}</li>
          );
        });
      }
      return (
        <h3>No comments yet</h3>
      );
    };
    return (
      <div>
        <h3><strong>Add Comments</strong></h3>
        <div className="flex-row">
          <div className="add-comments-container flex-col">
            <textarea onKeyDown={e => this.onKeyDown(e)} className="comments" ref={(ref) => { this.comment = ref; }}  onChange={e => this.handleChange(e)} />
            <button className="btn btn-primary" disabled={!this.state.comment} onClick={() => this.handleSubmitComment()}>Add Comment</button>
          </div>
          <div className="display-comments-container flex-col">
            {renderComments()}
          </div>
        </div>
      </div>
    );
  }
}

Comments.propTypes = {
  saved: PropTypes.function,
  id: PropTypes.string,
};
