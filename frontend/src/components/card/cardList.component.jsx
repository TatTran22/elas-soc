import React from 'react';

import { Example, IExampleProps } from '@blueprintjs/docs-theme';

import ProductCard from './productCard.component';
import MyCard from './MyCard';
import knx0 from '../../data/ABB-KNX-Products_0-100.json';
import knx1 from '../../data/ABB-KNX-Products_100-200.json';
import knx2 from '../../data/ABB-KNX-Products_200-300.json';
import knx3 from '../../data/ABB-KNX-Products_300-400.json';
import knx4 from '../../data/ABB-KNX-Products_400-500.json';
import knx5 from '../../data/ABB-KNX-Products_500-600.json';
import knx6 from '../../data/ABB-KNX-Products_600-700.json';
import knx7 from '../../data/ABB-KNX-Products_699-800.json';
import knx8 from '../../data/ABB-KNX-Products_800-881.json';

import './carList.style.scss';

class CardList extends React.Component {
  constructor(props) {
    super(props);
    let knxx = knx2
      .concat
      // knx1.concat(
      //   knx0.concat(
      //     knx3.concat(knx4.concat(knx5.concat(knx6.concat(knx7.concat(knx8)))))
      //   )
      // )
      ();

    this.state = {
      knx: knxx,
    };
  }

  render() {
    const { knx } = this.state;
    console.log(knx);
    return (
      <div className='card-list'>
        {knx.map(({ id, ...otherProps }) => (
          <ProductCard key={id} {...otherProps} />
        ))}
      </div>
    );
  }
}

export default CardList;
