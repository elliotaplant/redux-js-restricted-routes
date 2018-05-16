// src/App.js

import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import {Home, Public, Protected} from './components/pages' // Remove Login, Logout
import {Provider} from 'react-redux'
import store from './redux/store'
import AuthIndicator from './components/AuthIndicator'
import Login from './components/Login' // Add import to new file
import Logout from './components/Logout' // Add import to new file
import {restrictedRouteMaker} from './restrictedRouteMaker'

// Create route with auth restriction that redirects to /login
const mapStateToAuthProps = ({auth: { isAuthed }}) => ({ restricted: !isAuthed })
const AuthRestrictedRoute = restrictedRouteMaker('/login', mapStateToAuthProps)

// Create route with no-auth restriction that redirects to home
const mapStateToNoAuthProps = ({auth: { isAuthed }}) => ({ restricted: isAuthed })
const NoAuthRestrictedRoute = restrictedRouteMaker('/', mapStateToNoAuthProps)

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div style={{ padding: '20px' }}>
          <AuthIndicator />
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/public">Public Page</Link></li>
            <li><Link to="/protected">Protected Page</Link></li>
            <li><Link to="/login">Login Page</Link></li>
            <li><Link to="/logout">Logout Page</Link></li>
          </ul>
          <Route exact={true} path="/" component={Home}/>
          <Route path="/public" component={Public}/>
          <AuthRestrictedRoute path="/protected" component={Protected}/>
          <NoAuthRestrictedRoute path="/login" component={Login}/>
          <AuthRestrictedRoute path="/logout" component={Logout}/>
        </div>
      </Router>
    </Provider>
  )
}
