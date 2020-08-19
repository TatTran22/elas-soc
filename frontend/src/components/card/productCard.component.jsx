import * as React from 'react';
import './productCard.style.scss';
import {
  Button,
  Card,
  Classes,
  Elevation,
  H5,
  H6,
  Label,
  Slider,
  Switch,
  H4,
} from '@blueprintjs/core';
import { Example, IExampleProps } from '@blueprintjs/docs-theme';

const ProductCard = (props) => {
  const { title, orderCode, imageUrl, catalogDescription } = props;

  return (
    <div className=' product-card'>
      <Card>
        <div className='card-images'>
          <img alt={title} src={imageUrl[0]} />
        </div>
        <div className='card-description'>
          <H5 className='card-header'>{title}</H5>
          <div className='card-content'>
            <H6>{orderCode}</H6>
            <p>{catalogDescription}</p>
          </div>
        </div>
        <div className='extra-content'>
          <span>Warehouse: {23}</span>
          <span>Pending: {3}</span>
          <span>Ordering: {20}</span>
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;
