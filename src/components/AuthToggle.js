// src/components/AuthToggle.js

import React from 'react'
import {connect} from 'react-redux'
import {logInUser, logOutUser} from '../redux/actions'

const AuthToggle = ({isAuthed, logInUser, logOutUser}) =>(
  isAuthed
    ? <button onClick={logOutUser}>Sign Out</button>
    : <button onClick={logInUser}>Sign In</button>
)

const mapStateToProps = ({auth: {isAuthed}}) => ({isAuthed})
const mapDispatchToProps = {logInUser, logOutUser}

export default connect(mapStateToProps, mapDispatchToProps)(AuthToggle)
