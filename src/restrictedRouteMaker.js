// src/restrictedRouteMaker.js

import React from 'react'
import {connect, Provider} from 'react-redux'
import {compose} from 'redux'
import {Route, Redirect} from 'react-router-dom'

// HOC to either render the given component or redirect based on the `restricted` prop
const RedirectSwitch = ({ component: Component, restricted, redirectPath, ...rest }) => (
  restricted
    ? <Redirect to={redirectPath}/>
    : <Component {...rest}/>
)

// Adds `redirectPath` as an HOC injected prop to a RedirectSwitch
const addRedirectPathToSwitch = (redirectPath) => (props) => (
  <RedirectSwitch redirectPath={redirectPath} {...props}/>
)

// Component factory to wrap SwitchComponent inside a react-router Route
const makeSwitchRoute = (SwitchComponent) => ({ path, component: RenderComponent, ...rest }) => (
  <Route path={path} {...rest} render={props => <SwitchComponent component={RenderComponent} {...props}/>}/>
)

// Wraps all our other components in a HOC factory function
export default restrictedRouteMaker = (redirectPath, mapStateToRestricted) => compose(
  makeSwitchRoute,
  connect(mapStateToRestricted),
  addRedirectPathToSwitch
)(redirectPath)
