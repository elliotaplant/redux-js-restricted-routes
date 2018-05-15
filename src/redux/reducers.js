// src/redux/reducers.js

import {LOG_IN_USER, LOG_OUT_USER} from './actions'

// Reducer for handling auth actions
export function authReducer(state = { isAuthed: false }, action) {
  switch (action.type) {
    case LOG_IN_USER:
      return {
        ...state,
        isAuthed: true
      }
    case LOG_OUT_USER:
      return {
        ...state,
        isAuthed: false
      }
    default:
      return state
  }
}
