import React from 'react';

export class Comps extends React.Component {
  render() {
    const { registration } = this.props;

    const renderComps = () => (
      <div>
        <h3><strong>Comps</strong></h3>
        <p>AdNov Comp: {registration.AdNov}</p>
        <p>Amateur Couples: {registration['Amateur Couples']}</p>
        <p>Three State Open: {registration.Open}</p>
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
