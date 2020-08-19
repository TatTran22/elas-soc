import * as React from 'react';
import { Button, InputGroup, Intent, Tooltip } from '@blueprintjs/core';
import { FormGroup } from '@blueprintjs/core';
import Header from './../../components/header/header.component';
// using node-style package resolution in a CSS file:
import './login.style.scss';

export class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      large: true,
      filterValue: '',
      showPassword: false,
      darkTheme: true,
    };
  }
  
  handleLockClick = () =>
    this.setState({ showPassword: !this.state.showPassword });
  handleThemeChange = () => {
    this.setState({ darkTheme: !this.state.darkTheme });
    console.log(this.state.darkTheme);
  };
  render() {
    const {
      disabled,
      filterValue,
      large,
      small,
      showPassword,
      darkTheme,
    } = this.state;

    const lockButton = (
      <Tooltip
        content={`${showPassword ? 'Hide' : 'Show'} Password`}
        disabled={disabled}
      >
        <Button
          disabled={disabled}
          icon={showPassword ? 'eye-open' : 'eye-off'}
          intent={Intent.WARNING}
          minimal={true}
          onClick={this.handleLockClick}
        />
      </Tooltip>
    );

    return (
      <div className={`loginPage ${darkTheme ? 'bp3-dark' : ''}`}>
        <div className='container'>
          <Header onThemeChange={this.handleThemeChange} />
          <div className='login-form'>
            <FormGroup label='Login to ELAS' labelFor='email-input'>
              <InputGroup
                id='email-input'
                placeholder='Email address'
                type='email'
                large={large}
              />
              <InputGroup
                disabled={false}
                placeholder='Password'
                rightElement={lockButton}
                type={showPassword ? 'text' : 'password'}
                large={large}
              />
              <Button
                icon='log-in'
                text='Login'
                type='submit'
                intent='primary'
              />
              <div className='form-helper'>
                <Button
                  text='Forget account?'
                  minimal={true}
                  small={true}
                  intent='warning'
                />
                <Button
                  text='Sign up'
                  minimal={true}
                  small={true}
                  intent='success'
                />
              </div>
            </FormGroup>
          </div>
        </div>
      </div>
    );
  }
}
export default LoginPage;
