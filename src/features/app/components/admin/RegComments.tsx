import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import * as _ from 'lodash';
import { Link } from 'react-router';

import * as api from '../../../data/api';
import { IRegistration } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface IComment {
  index: number,
  BookingID: number,
  FirstName: string,
  LastName: string,
  Comment: string,
}

interface RegCommentsProps {
  registrations: IRegistration[],
}

const setupComments = (registrations: IRegistration[]): IComment[] => {
  const comments: IComment[] = [];
  _.forEach(registrations, (r) => {
    if (r) {
      if (r.Comments) {
        _.forEach(r.Comments, (c, index) => {
          const object: IComment = {
            index,
            BookingID: r.BookingID,
            FirstName: r.FirstName,
            LastName: r.LastName,
            Comment: c,
          };

          comments.push(object);
        });
      }
    }
  });

  return comments;
}

export const RegComments: FC<RegCommentsProps> = (props) => {
  const { registrations } = props;
  
  const [comments, setComments] = useState<IComment[]>(null);

  useEffect(() => {
    if (registrations) {
      const comments = setupComments(registrations);
      setComments(comments);
    }
  });

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
        {
          comments
          &&
          comments.map((comment, index) =>
            <div key={index} className="flex-row">
              <span className="col-xs-1"><Link to={`editregistration/${comment.BookingID}`}>{comment.BookingID}</Link></span>
              <span className="col-xs-2">{comment.FirstName}</span>
              <span className="col-xs-2">{comment.LastName}</span>
              <span className="col-xs-5">{comment.Comment}</span>
            </div>
          )
        }
        {
          !comments
          &&
          <h3>No Issues</h3>
        }
      </div>
    </div>
  );
}
