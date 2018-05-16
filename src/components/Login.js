// src/components/Login.js

import React from 'react'
import {connect} from 'react-redux'
import {logInUser} from '../redux/actions'

// A functional component that requires a logInUser function as a parameter
const Login = ({ logInUser }) => (
  <div>
    <h3>Login</h3>
    <button onClick={logInUser}>Log in</button>
  </div>
)

// Gives the login button ability to dispatch to store
export default connect(null, {logInUser})(Login)
