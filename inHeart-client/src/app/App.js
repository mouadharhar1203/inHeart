import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';
import { Layout, notification } from 'antd';

import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Clients from '../clients/Clients';
import Profile from "../user/profile/Profile" 
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';

const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // to get the connected user
      currentUser: null,
      isAuthenticated: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    // Notification popup
    notification.config({
      placement: 'topLeft',
      top: 70,
      duration: 3,
    });    
  }

  // Load the connected user infos
  loadCurrentUser() {
      getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true
        });
      }).catch(error => {
        notification.warning({
          message: 'SPREACT SHOP',
          description: "You are not connected !",
        }); 
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  // On logout : delete token from localStorage and redirect to login page
  handleLogout(redirectTo="/login", notificationType="success", description="You're successfully logged out.") {
      localStorage.removeItem(ACCESS_TOKEN);

      this.setState({
        currentUser: null,
        isAuthenticated: false
      });

      this.props.history.push(redirectTo);
      
      notification[notificationType]({
        message: 'SPREACT SHOP',
        description: description,
      });
  }

  // After login : notification + redirect to homePage (Clients table)
  handleLogin() {
      notification.success({
        message: 'SPREACT SHOP',
        description: "You're successfully logged in.",
      });
      this.loadCurrentUser();
      this.props.history.push("/");
  }

  render() {

    return (
        <Layout className="app-container">

          <div style={{ width:'auto', marginLeft:'0px', marginRight:'0px' }}>     
            <AppHeader isAuthenticated={this.state.isAuthenticated} 
              currentUser={this.state.currentUser} 
              onLogout={this.handleLogout} /><br/>
              </div>
          <Content className="app-content">
            <br/>
            <div style={{ width:'auto', marginLeft:'0px', marginRight:'0px' }}>
              <Switch>
                <Route exact path="/" render={(props) => <Clients />}></Route>
                <Route path="/profile" render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}></Route>
                <Route exact path="/login" render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route component={NotFound}></Route>
              </Switch>
            </div>
          </Content>
        </Layout>
    );
  }
}

export default withRouter(App);
