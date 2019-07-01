
import * as React from 'react';
import { FunctionComponent } from 'react';
import * as _ from 'lodash';
import { IComps } from '../../../data/interfaces';

export interface IParterOrRoleProps {
  comp: IComps,
  allComps: IComps[],
  registrationComps: IComps[],
  handlePartnerChange: (value: string, key: string) => void,
  handleRoleChange: (value: string, key: string) => void
}

export const PartnerOrRole: FunctionComponent<IParterOrRoleProps> = (props: IParterOrRoleProps) => {
  const { comp, allComps, registrationComps, handlePartnerChange, handleRoleChange } = props;
  const compData = _.find(allComps, c => c.key === comp.key);
  const found = _.find(registrationComps, c => c.key === comp.key);
  if (found) {
    if (compData.partner) {
      return (
        <input type="text" value={found.partner} onChange={e => handlePartnerChange(e.target.value, comp.key)} />
      );
    } else if (compData.role) {
      return (
        <select value={found.role} onChange={e => handleRoleChange(e.target.value, comp.key)}>
          <option value=""></option>
          <option value="Lead">Lead</option>
          <option value="Follow">Follow</option>
        </select>
      );
    }
  }
  return null;
};