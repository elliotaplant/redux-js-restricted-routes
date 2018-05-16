// src/App.js

import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
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
          <Route exact={true} path="/" component={() => <h3>Home</h3>}/>
          <Route path="/public" component={() => <h3>Public</h3>}/>
          <Route path="/protected" component={() => <h3>Protected</h3>}/>
          <Route path="/login" component={() => <h3>Login</h3>}/>
          <Route path="/logout" component={() => <h3>Logout</h3>}/>
        </div>
      </Router>
    </Provider>
  )
}
