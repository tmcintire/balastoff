import * as React from 'react';
import * as _ from 'lodash';
import { FunctionComponent } from 'react';
import { IMissionGearIssue } from '../../../data/interfaces';
import { toggleResolved } from '../../../data/helpers';

interface EditMissionGearIssuesProps {
  issues: IMissionGearIssue[],
  id: string,
  saved: () => void,
}

export const EditMissionGearIssues: FunctionComponent<EditMissionGearIssuesProps> = (props) => {
  const { issues, saved, id } = props;
  const renderMissionGearIssues = () => {
    const regIssues = _.pickBy(issues, i => i.BookingID.toString() === id);
    if (!_.isEmpty(regIssues)) {
      return Object.keys(regIssues).map(key =>
        <div key={key} className={`${regIssues[key].Resolved ? 'resolved-class' : ''} flex-row`}>
          <span className="col-xs-10">{regIssues[key].Issue}</span>
          <span className="col-xs-2">
            <input
              type="checkbox"
              checked={regIssues[key].Resolved}
              onChange={e => { 
                toggleResolved(issues, key);
                saved();
              }}
            />
          </span>
        </div>
      );
    }
    return (
      <p>No issues</p>
    );
  };
  return (
    <div>
      <h3><strong>Mission Gear Issues</strong></h3>
      {renderMissionGearIssues()}
    </div>
  );
};
