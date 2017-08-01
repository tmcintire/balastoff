import React from 'react';
import * as api from '../../../data/api';

export class Comments extends React.Component {
  constructor() {
    super();

    this.state = {
      comment: null,
    };
  }
  handleClick = () => {
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
        return this.props.registration.Comments.map((comment) => {
          return (
            <li>{comment}</li>
          );
        });
      }
      return (
        <h3>No comments yet</h3>
      );
    };
    return (
      <div>
        <h3><strong>Comments</strong></h3>
        <div className="flex-row">
          <div className="add-comments-container flex-col">
            <textarea className="comments" ref={(ref) => { this.comment = ref; }}  onChange={e => this.handleChange(e)} />
            <button className="btn btn-primary" disabled={!this.state.comment} onClick={() => this.handleClick()}>Add Comment</button>
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
  saved: React.PropTypes.function,
  id: React.PropTypes.string,
};
