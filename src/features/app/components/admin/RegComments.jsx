import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class RegComments extends React.Component {
  constructor(props) {
    super(props);

    if (props.registrations) {
      this.setupState(props.registrations);
    } else {
      this.state = {
        comments: [],
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      this.setupState(nextProps.registrations);
    }
  }

  setupState(registrations) {
    const comments = [];
    _.forEach(registrations, (r) => {
      if (r) {
        if (r.Comments) {
          _.forEach(r.Comments, (c, index) => {
            const object = {
              index,
              BookingID: r.BookingID,
              'First Name': r['First Name'],
              'Last Name': r['Last Name'],
              Comment: c,
            };

            comments.push(object);
          });
        }
      }
    });

    this.state = {
      comments,
    };
  }

  render() {
    const renderComments = () => {
      if (this.state.comments) {
        return this.state.comments.map((comment, index) =>
          <div key={index} className="flex-row">
            <span className="col-xs-1"><Link to={`editregistration/${comment.BookingID}`}>{comment.BookingID}</Link></span>
            <span className="col-xs-2">{comment['First Name']}</span>
            <span className="col-xs-2">{comment['Last Name']}</span>
            <span className="col-xs-5">{comment.Comment}</span>
          </div>
        );
      }
      return (
        <h3>No Issues</h3>
      );
    };

    return (
      <div className="container mission-gear-issues">
        <h1>Registration Comments</h1>
        <div className="row issues-table-header">
          <span className="col-xs-1">ID</span>
          <span className="col-xs-2">First Name</span>
          <span className="col-xs-2">Last Name</span>
          <span className="col-xs-5">Comment</span>
        </div>
        <hr />
        <div className="issues-table row">
          {renderComments()}
        </div>
      </div>
    );
  }
}
