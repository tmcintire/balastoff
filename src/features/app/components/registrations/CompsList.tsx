import * as React from 'react';
import { FunctionComponent } from 'react';
import * as _ from 'lodash';
import { IComps } from '../../../data/interfaces';
import { PartnerOrRole } from './ParterOrRole';

export interface ICompsListProps {
  allComps: IComps[],
  registrationComps: IComps[],
  compSelectionChange: (e: any, comps: IComps) => void,
  handlePartnerChange: (value: string, key: string) => void,
  handleRoleChange: (value: string, key: string) => void
}

export const CompsList: FunctionComponent<ICompsListProps> = (props: ICompsListProps) => {
  const { allComps, registrationComps, handlePartnerChange, handleRoleChange, compSelectionChange } = props;

  const renderComps = () => allComps.map((comp, index) => {
    const isSelected = _.some(registrationComps, rc => rc.key === comp.key);
  
    return (
      <div key={index} className="info-container">
        <div className="comp-info flex-align-center flex-row flex-justify-space-between">
          <div className="flex-row">
            <input type="checkbox" checked={isSelected} onChange={e => compSelectionChange(e, comp)} />
            <span>{comp.name}(${comp.price}): </span>
          </div>
          <div className="partner-role-container">
            <PartnerOrRole comp={comp} {...props} />
          </div>
        </div>
      </div>
    );
  });


  return (
    <>
      {renderComps()}
    </>
  );
}