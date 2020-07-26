import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import { Layout, Menu, Dropdown, Icon } from 'antd';
const Header = Layout.Header;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        let menuItems;
        if(this.props.currentUser) {
          menuItems = [
            <Menu.Item key="/">
              <Link to="/home">
                <Icon type="home" className="nav-icon" />
              </Link>
            </Menu.Item>,
            <Menu.Item key="/profile" className="profile-menu">
                  <ProfileDropdownMenu 
                    currentUser={this.props.currentUser} 
                    handleMenuClick={this.handleMenuClick}/>
              </Menu.Item>
          ]; 
        } else {
          menuItems = [
            <Menu.Item key="/login">
              <Link to="/login">Login</Link>
            </Menu.Item> ,
            <Menu.Item key="/signup">
              <Link to="/signup">Sign Up</Link>
            </Menu.Item>                  
          ];
        }

        return (
            <Header className="app-header">
            <div>
              <div className="app-title" >
                <Link to="#"><img className="logo_image" src="https://www.inheart.fr/wp-content/uploads/2018/05/Logo-inHEART-Blue-BG-T-1.png"  alt="" width="300" height="50" /></Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
            </div>
          </Header>
        );
    }
}

function ProfileDropdownMenu(props) {

  // Items of the menu
  const dropdownMenuAdmin = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="username-info">
          @{' '}{props.currentUser.username}
        </div>
        <div className="user-full-name-info">
          {props.currentUser.role}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/profile/${props.currentUser.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  
  if(props.currentUser.role === 'ROLE_ADMIN') {
      return (
        // Dropdown items
        <Dropdown 
          overlay={dropdownMenuAdmin} 
          trigger={['click']}
          getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
          <a className="ant-dropdown-link">
            <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
          </a>
        </Dropdown>
      );
  }

}

export default withRouter(AppHeader);