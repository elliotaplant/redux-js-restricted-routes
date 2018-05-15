import {createStore} from 'redux';
import {combineReducers} from 'redux'
import {authReducer} from './reducers'

const reducers = combineReducers({
  auth: authReducer,
})

const store = createStore(reducers)

export default store
