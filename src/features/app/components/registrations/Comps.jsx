import React from 'react';
import * as api from '../../../data/api';

export class Comps extends React.Component {
  handleValueChange = (e, comp) => {
    const object = {
      [comp]: e.target.value,
    };

    api.updateRegistration(this.props.id, object);
  }

  render() {
    const { registration } = this.props;

    const renderComps = () => (
      <div>
        <h3><strong>Comps</strong></h3>
        <div className="info-container">
          <span className="full-width">AdNov Comp: </span>
          <select className="form-control" id="type" value={registration.AdNov} onChange={e => this.handleValueChange(e, 'AdNov')}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="info-container">
          <span className="full-width">Amateur Couples: </span>
          <select className="form-control" id="type" value={registration['Amateur Couples']} onChange={e => this.handleValueChange(e, 'Amateur Couples')}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="info-container">
          <span className="full-width">Three State Open: </span>
          <select className="form-control" id="type" value={registration.Open} onChange={e => this.handleValueChange(e, 'Open')}>
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

Comps.propTypes = {
  registration: React.PropTypes.array,
};
