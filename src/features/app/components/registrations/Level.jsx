import React from 'react';

export class Level extends React.Component {
  render() {
    const { level, hasLevelCheck } = this.props;

    const renderComps = () => (
      <div>
        <h3><strong>Track Information</strong></h3>
        <p>Level: {level}</p>
        <p>Level Check: {hasLevelCheck}</p>
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
