import React from 'react'
import {connect, Provider} from 'react-redux'
import {compose} from 'redux'
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom'
import store from './redux/store'
import {logInUser, logOutUser} from './redux/actions'

// Pages to display
const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>
const Secret = () => <h3>Secret</h3>
const Signup = () => <h3>Signup</h3>

// Login page that redirects to to history
const Login = ({ logInUser }) => (
  <div>
    <p>You must log in to view the page</p>
    <button onClick={logInUser}>Log in</button>
  </div>
)

// Gives the login button ability to
const ConnectedLogin = connect(null, { logInUser })(Login)

// Either render the given component or redirect based on whether or not the component is restricted
const RedirectSwitch = ({ match, component: Component, restricted, redirectPath, ...rest }) => (
  restricted
    ? <Redirect to={{ pathname: redirectPath, state: { from: match.url } }}/>
    : <Component {...rest}/>
)


// Component factory function to
const makeSwitchRoute = (SwitchComponent) => ({ path, component: RenderComponent, ...rest }) => (
  <Route path={path} {...rest} render={props => <SwitchComponent component={RenderComponent} {...props}/>}/>
)
// Add redirectPath prop to our switch
const addRedirectPathToSwitch = (redirectPath) => (props) => <RedirectSwitch redirectPath={redirectPath} {...props}/>
// Factory solution
// const restrictedRouteMaker = (redirectPath, mapStateToRestricted) =>
//   makeSwitchRoute(connect(mapStateToRestricted)(addRedirectPathToSwitch(redirectPath)))
// Factory solution with compose
const restrictedRouteMaker = (redirectPath, mapStateToRestricted) => compose(
  makeSwitchRoute,
  connect(mapStateToRestricted),
  addRedirectPathToSwitch
)(redirectPath)

// Create route with auth restriction
const RedirectLoginSwitch = (props) => <RedirectSwitch redirectPath="/login" {...props}/>
const mapStateToAuthProps = ({auth: { isAuthed }}) => ({ restricted: !isAuthed })
const ConnectedAuthSwitch = connect(mapStateToAuthProps)(RedirectLoginSwitch)
// const AuthRestrictedRoute = makeSwitchRoute(ConnectedAuthSwitch)
const AuthRestrictedRoute = restrictedRouteMaker('/login', mapStateToAuthProps);

const RedirectProtectedSwitch = (props) => <RedirectSwitch redirectPath="/protected" {...props}/>
const mapStateToNoAuthProps = ({auth: { isAuthed }}) => ({ restricted: isAuthed })
const ConnectedNoAuthSwitch = connect(mapStateToNoAuthProps)(RedirectProtectedSwitch)
// const NoAuthRestrictedRoute = makeSwitchRoute(ConnectedNoAuthSwitch)
const NoAuthRestrictedRoute = restrictedRouteMaker('/protected', mapStateToNoAuthProps);



// Button to log you in if you aren't
const mapAuthStateToProps = ({auth: { isAuthed }}) => ({isAuthed})
const AuthButton = connect(mapAuthStateToProps, { logOutUser })(({ isAuthed, logOutUser }) => (
    isAuthed
      ? <p> Welcome! <button onClick={logOutUser}>Sign out</button></p>
      : <p>You are not logged in.</p>
  )
)

export default function AuthExample() {
  return (<Provider store={store}>
    <Router>
      <div>
        <AuthButton/>
        <ul>
          <li> <Link to="/">Public Page</Link> </li>
          <li> <Link to="/protected">Protected Page</Link> </li>
          <li> <Link to="/secret">Secret Page</Link> </li>
          <li> <Link to="/login">Login Page</Link> </li>
          <li> <Link to="/signup">Signup Page</Link> </li>
        </ul>
        <Route exact={true} path="/" component={Public}/>
        <AuthRestrictedRoute path="/protected" component={Protected}/>
        <AuthRestrictedRoute path="/secret" component={Secret}/>
        <NoAuthRestrictedRoute path="/login" component={ConnectedLogin}/>
        <NoAuthRestrictedRoute path="/signup" component={Signup}/>
      </div>
    </Router>
  </Provider>)
}
