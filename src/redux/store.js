// src/redux/store.js

import {combineReducers, createStore} from 'redux'
import {authReducer} from './reducers'

const reducers = combineReducers({
  auth: authReducer,
})

const store = createStore(reducers)

export default store
