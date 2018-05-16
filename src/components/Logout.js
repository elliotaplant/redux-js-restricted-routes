// src/components/Logout.js

import React from 'react'
import {connect} from 'react-redux'
import {logOutUser} from '../redux/actions'

// A functional component that requires a logOutUser function as a parameter
const Logout = ({ logOutUser }) => (
  <div>
    <h3>Logout</h3>
    <button onClick={logOutUser}>Log out</button>
  </div>
)

// Gives the logout button the ability to dispatch to store
export default connect(null, {logOutUser})(Logout)
