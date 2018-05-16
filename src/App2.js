import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <ul>
          <li><Link to="/login">Login Page</Link></li>
          <li><Link to="/logout">Logout Page</Link></li>
        </ul>
        <Route path="/login" component={() => <h3>Login</h3>}/>
        <Route path="/logout" component={() => <h3>Logout</h3>}/>
      </div>
    </Router>
  )
}
