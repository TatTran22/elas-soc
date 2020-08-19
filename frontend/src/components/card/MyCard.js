import React from 'react';
import './MyCard.scss';

const MyCard = (props) => {
  const {
    imageUrl,
    orderCode,
    catalogDescription,
    title,
    categories,
    originalLink,
  } = props;
  const cg = categories.split('»');

  return (
    <div className='my-card'>
      <div className='image'>
        <img src={imageUrl[0]} />
      </div>
      <div className='content'>
        <div className='header'>{title}</div>
        <div className='meta'>
          <a href={originalLink} target='_blank' alt={title}>
            {orderCode}
            <i className='linkify icon' />
          </a>
        </div>
        <div className='description'>{catalogDescription}</div>
      </div>
      <div className='extra-content'>
        <span className='category'>{cg[cg.length - 1].trim()}</span>
        <span className='products-remain'>
          <i className='archive icon '></i>
          75 available
        </span>
      </div>
    </div>
  );
};

export default MyCard;
