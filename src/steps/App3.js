// src/App.js

import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import {Home, Public, Protected, Login, Logout} from './components/pages'
import {Provider} from 'react-redux'
import store from './redux/store'
import AuthIndicator from './components/AuthIndicator'

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
          <Route path="/protected" component={Protected}/>
          <Route path="/login" component={Login}/>
          <Route path="/logout" component={Logout}/>
        </div>
      </Router>
    </Provider>
  )
}
