import * as React from 'react';

import {
  Alignment,
  Button,
  Switch,
  Menu,
  Label,
  Icon,
  MenuItem,
  MenuDivider,
  Popover,
  Position,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from '@blueprintjs/core';
// using node-style package resolution in a CSS file:

import './header.style.scss';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      darkTheme: this.props.darkTheme,
      alignRight: false,
    };
  }

  handleThemeChangeClick = () => {
    this.props.onThemeChange(this.state.darkTheme);
    this.setState({ darkTheme: !this.state.darkTheme });
  };

  render() {
    const { alignRight } = this.state;
    const iconLight = <Icon icon={'flash'}></Icon>;
    const iconDark = <Icon icon={'moon'}></Icon>;

    const settingMenu = (
      <Menu>
        <MenuItem
          shouldDismissPopover={false}
          icon={this.state.darkTheme ? 'flash' : 'moon'}
          text={this.state.darkTheme ? 'Light theme' : 'Dark theme'}
          onClick={this.handleThemeChangeClick}
        />
      </Menu>
    );

    return (
      <div>
        <Navbar>
          <NavbarGroup align={alignRight ? Alignment.RIGHT : Alignment.LEFT}>
            <Button
              icon='home'
              text=''
              className='header-buttons'
              minimal={true}
            >
              <NavbarHeading>ELAS Smarthome</NavbarHeading>
            </Button>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <Button
              className='header-buttons'
              minimal={true}
              icon='user'
              text='Login'
            />
            <Button
              className='header-buttons'
              minimal={true}
              icon='notifications'
              text=''
            />
            <NavbarDivider />
            <Popover content={settingMenu} position={Position.RIGHT_BOTTOM}>
              <Button
                className='header-buttons'
                minimal={true}
                icon='cog'
                text='Settings'
              />
            </Popover>
          </NavbarGroup>
        </Navbar>
      </div>
    );
  }
}
export default Header;
