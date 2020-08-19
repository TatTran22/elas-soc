import * as React from 'react';
import { Icon, Intent } from '@blueprintjs/core';
import './footer.style.scss';

const Footer = () => {
  return (
    <div className='footer'>
      <div class='footer-right'>
        <Icon icon='code' intent='none' /> with{' '}
        <Icon icon='heart' color='#F55656' /> by <span>Tất Trần</span>
      </div>
    </div>
  );
};

export default Footer;
