// src/components/AuthIndicator.js

import React from 'react'
import {connect} from 'react-redux'

const AuthIndicator = ({isAuthed}) =>(
  isAuthed
    ? <p>Welcome! You are logged in</p>
    : <p>You are not logged in. Please log in to view protected content</p>
)

const mapStateToProps = ({auth: { isAuthed }}) => ({isAuthed})

export default connect(mapStateToProps)(AuthIndicator)
