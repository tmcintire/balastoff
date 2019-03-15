import * as React from 'react';
import { FunctionComponent } from 'react';

interface LevelProps {
  level: string,
  hasLevelCheck: boolean,
}

export const Level: FunctionComponent<LevelProps> = (props) => {
  const { level, hasLevelCheck } = props;

  const renderLevel = () => (
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
      {renderLevel()}
    </div>
  );
}
