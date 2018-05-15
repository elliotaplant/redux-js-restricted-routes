import {createStore} from 'redux';
import {combineReducers} from 'redux'
import {LOG_IN_USER, LOG_OUT_USER} from './actions'

function auth(state = { isAuthed: false }, action) {
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

const appReducers = combineReducers({
  auth,
  // ... your other reducers
})

const store = createStore(appReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store
