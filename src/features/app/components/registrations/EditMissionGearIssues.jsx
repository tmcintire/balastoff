import React from 'react';

export const EditMissionGearIssues = (props) => {
  const { issues } = props;
  const renderMissionGearIssues = () => {
    if (issues) {
      return issues.map((issue, index) =>
        <div key={index} className={`${issue.Resolved ? 'resolved-class' : ''} flex-row`}>
          <span className="col-xs-10">{issue.Issue}</span>
          <span className="col-xs-2">
            <input
              type="checkbox"
              checked={issue.Resolved}
              onChange={e => props.toggleResolved(e, props.id, index)}
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

EditMissionGearIssues.propTypes = {
  issues: React.PropTypes.array,
};
