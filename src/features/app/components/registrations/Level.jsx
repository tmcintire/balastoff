import React from 'react';
import * as api from '../../../data/api';

export class Level extends React.Component {
  handleValueChange = (e, comp) => {
    const object = {
      [comp]: e.target.value,
    };

    api.updateRegistration(this.props.id, object);
    this.props.saved();
  }
  render() {
    const { level, hasLevelCheck } = this.props;

    const renderComps = () => (
      <div className="level-container">
        <h3><strong><u>Track Information</u></strong></h3>
        <div className="track-info-container">
          <span className="full-width"><strong>Level: </strong>{level} </span>
          <span className={`${hasLevelCheck === 'Yes' ? 'has-level-check' : ''} full-width`}><strong>Level Check: </strong>{hasLevelCheck} </span>
        </div>

      </div>
    );
    return (
      <div>
        {renderComps()}
      </div>
    );
  }
}

Level.propTypes = {
  level: React.PropTypes.string,
  hasLevelCheck: React.PropTypes.boolean,
};
