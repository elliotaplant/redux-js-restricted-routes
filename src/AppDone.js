// src/App.js

import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './redux/store'
import AuthIndicator from './components/AuthIndicator'
import Login from './components/Login' // Add import
import Logout from './components/Logout' // Add import
import restrictedRouteMaker from './restrictedRouteMaker'

// Create route with auth restriction
const mapStateToAuthProps = ({auth: { isAuthed }}) => ({ restricted: !isAuthed })
const AuthRestrictedRoute = restrictedRouteMaker('/login', mapStateToAuthProps)

// Create route with no-auth restriction
const mapStateToNoAuthProps = ({auth: { isAuthed }}) => ({ restricted: isAuthed })
const NoAuthRestrictedRoute = restrictedRouteMaker('/protected', mapStateToNoAuthProps)

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div style={{ padding: '20px' }}>
          <AuthIndicator />
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login Page</Link></li>
            <li><Link to="/logout">Logout Page</Link></li>
          </ul>
          <Route exact={true} path="/" component={() => <h3>Home</h3>}/>
          <NoAuthRestrictedRoute path="/login" component={Login}/>
          <AuthRestrictedRoute path="/logout" component={Logout}/>
        </div>
      </Router>
    </Provider>
  )
}
