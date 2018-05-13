import { createStore } from 'redux';
import { combineReducers } from 'redux'
import {
  AUTH_USER,
  LOG_OUT_USER,
} from './actions'

function authReducer(state = { isAuthed: false }, action) {
  switch (action.type) {
    case AUTH_USER:
      return {
          ...state,
        {
          isAuthed: true,
        }
      }
    case LOG_OUT_USER:
      return {
          ...state,
        {
          isAuthed: true,
        }
      }
    default:
      return state
  }
}

const appReducers = combineReducers({
  authReducer,
  // ... your other reducers
})

const store = createStore(appReducers)
