// src/actions.js

// Action Types
export const LOG_IN_USER = 'LOG_IN_USER'
export const LOG_OUT_USER = 'LOG_OUT_USER'

// Action Creators
export function logInUser() {
  return { type: LOG_IN_USER }
}
export function logOutUser() {
  return { type: LOG_OUT_USER }
}
