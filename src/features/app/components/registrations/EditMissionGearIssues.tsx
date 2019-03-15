import * as React from 'react';
import { FunctionComponent } from 'react';
import { IMissionGearIssue } from '../../../data/interfaces';

interface EditMissionGearIssuesProps {
  issues: IMissionGearIssue[],
  toggleResolved: (id: string, issueId: string) => void,
  id: string
}

export const EditMissionGearIssues: FunctionComponent<EditMissionGearIssuesProps> = (props) => {
  const { issues } = props;
  const renderMissionGearIssues = () => {
    if (issues) {
      return issues.map((issue) =>
        <div key={issue.IssueId} className={`${issue.Resolved ? 'resolved-class' : ''} flex-row`}>
          <span className="col-xs-10">{issue.Issue}</span>
          <span className="col-xs-2">
            <input
              type="checkbox"
              checked={issue.Resolved}
              onChange={e => props.toggleResolved(props.id, issue.IssueId)}
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
