// src/components/Logout.js
import React from 'react'
import {connect} from 'react-redux'
import {logOutUser} from '../redux/actions'

// Logout page
const Logout = ({ logOutUser }) => (
  <div>
    <h3>Logout</h3>
    <button onClick={logOutUser}>Log out</button>
  </div>
)

// Gives the logout button ability to dispatch to store
export default connect(null, {logOutUser})(Logout)
