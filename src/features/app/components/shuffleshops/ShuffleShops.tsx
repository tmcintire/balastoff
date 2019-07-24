import * as React from 'react';
import {FunctionComponent, useEffect, useState} from 'react';
import * as _ from 'lodash';
import { IRegistration, IPartnerComp, IRoleComp } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface IShuffleShopsProps {
  registrations: IRegistration[],
  loading: boolean
}

interface IShuffleShop {
  [name: string]: string[],
}

export const ShuffleShops: FunctionComponent<IShuffleShopsProps> = (props) => {
  const { registrations } = props;

  const [shuffleShops, setShuffleShops] = useState<IShuffleShop>(null);

  useEffect(() => {
    const ss = {};
    _.forEach(registrations, r => {
      if (r && r.ShuffleShops) {
        _.forEach(r.ShuffleShops, s => {
          if (!ss[s]) {
            ss[s] = [];
          }
          
          ss[s].push(`${r.FirstName} ${r.LastName}`);

          if (s === 'Crafting a Partnership w/ Nick Williams') {
            ss[s].push(r.SSNickPartner);
          }
        });
      }
    });

    setShuffleShops(ss);
  }, [registrations]);


  const renderShuffleShops = () => {
    return Object.keys(shuffleShops).map((key, index) => {
      const shuffleShop = shuffleShops[key];

      return (
        <>
          <div className="flex-col">
            <h2>{key}</h2>
            {
              shuffleShop.map(name => (
                <div>{name}</div>
              ))
            }
          </div>
        </>
      );
    });
  }

  return (
    <>
      <h1 className="text-center flex-col">Shuffle Shops</h1>
      <hr />
      <div className="flex-row flex-wrap flex-justify-space-around">
        {shuffleShops && renderShuffleShops()}
      </div>
    </>
  );
}
