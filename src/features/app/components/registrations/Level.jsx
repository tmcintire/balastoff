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
        <h3><strong>Track Information</strong></h3>
        <div className="info-container">
          <span className="full-width">Level: </span>
          <select className="form-control" id="type" value={level} onChange={e => this.handleValueChange(e, 'Level')}>
            <option value="Staff">Staff</option>
            <option value="Beginner">Beginner</option>
            <option value="Mercury">Mercury</option>
            <option value="Gemini">Gemini</option>
            <option value="Apollo">Apollo</option>
            <option value="Skylab">Skylab</option>
            <option value="Space-X">Space-X</option>
          </select>
        </div>
        <div className="info-container">
          <span className="full-width">Level Check: </span>
          <select className="form-control" id="type" value={hasLevelCheck} onChange={e => this.handleValueChange(e, 'HasLevelCheck')}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
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
