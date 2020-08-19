import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { FocusStyleManager } from '@blueprintjs/core';

import LoginPage from './pages/loginPage/login.page';
import HomePage from './pages/homepage/HomePage';
import ProductPage from './pages/ProductsPage/product.page';
import './App.css';

FocusStyleManager.onlyShowFocusOnTabs();

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/products' component={ProductPage} />
          <Route path='/login' component={LoginPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
