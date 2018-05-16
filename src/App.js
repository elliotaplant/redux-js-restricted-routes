// src/App.js
import React from 'react'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import store from './redux/store'
import AuthIndicator from './components/AuthIndicator'
import AuthButton from './components/AuthButton'
import {Public, Protected} from './components/pages'
import restrictedRouteMaker from './restrictedRouteMaker'
import Login from './components/Login'
import Logout from './components/Logout'

// Create route with auth restriction
const mapStateToAuthProps = ({auth: { isAuthed }}) => ({ restricted: !isAuthed })
const AuthRestrictedRoute = restrictedRouteMaker('/login', mapStateToAuthProps);

// Create route with no-auth restriction
const mapStateToNoAuthProps = ({auth: { isAuthed }}) => ({ restricted: isAuthed })
const NoAuthRestrictedRoute = restrictedRouteMaker('/protected', mapStateToNoAuthProps);

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div style={{ padding: '20px' }}>
          <AuthIndicator />
          <AuthButton />
          <ul>
            <li><Link to="/login">Login Page</Link></li>
            <li><Link to="/logout">Logout Page</Link></li>
            <li><Link to="/public">Public Page</Link></li>
            <li><Link to="/protected">Protected Page</Link></li>
          </ul>
          <NoAuthRestrictedRoute path="/login" component={Login}/>
          <AuthRestrictedRoute path="/logout" component={Logout}/>
          <Route path="/public" component={Public}/>
          <AuthRestrictedRoute path="/protected" component={Protected}/>
        </div>
      </Router>
    </Provider>
  )
}
