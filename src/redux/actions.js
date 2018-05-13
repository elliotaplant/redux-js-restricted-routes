/*
 * action types
 */

export const AUTH_USER = 'AUTH_USER'
export const LOG_OUT_USER = 'LOG_OUT_USER'
// ...your other action types

/*
 * action creators
 */

export function authUser() {
  return { type: AUTH_USER }
}

export function logOutUser() {
  return { type: LOG_OUT_USER }
}
