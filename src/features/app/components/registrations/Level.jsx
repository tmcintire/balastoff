import React from 'react';
import PropTypes from 'prop-types';

export const Level = (props) => {
  const { level, hasLevelCheck } = props;

  const renderComps = () => (
    <div className="level-container">
      <h3><strong><u>Track Information</u></strong></h3>
      <div className="track-info-container">
        <span className="full-width"><strong>Level: </strong>{level} </span>
        <span className={`${hasLevelCheck ? 'has-level-check' : ''} full-width`}><strong>Level Check: </strong>{hasLevelCheck ? 'Yes' : 'No'} </span>
      </div>

    </div>
  );

  return (
    <div>
      {renderComps()}
    </div>
  );
};

Level.propTypes = {
  level: PropTypes.string,
  hasLevelCheck: PropTypes.boolean,
};
