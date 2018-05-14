import React from 'react'
import {connect, Provider} from 'react-redux'
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom'
import store from './redux/store'
import {authUser, logOutUser} from './redux/actions'

// Pages to display
const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

// Login page that redirects to to history
const Login = ({ authUser }) => (
  <div>
    <p>You must log in to view the page</p>
    <button onClick={authUser}>Log in</button>
  </div>
)

// Gives the login button ability to
const ConnectedLogin = connect(null, { authUser })(Login)

// Either render the given component or redirect based on whether or not the component is restricted
const RestrictedSwitch = ({ match, component: Component, restricted, redirectPath, ...rest }) => (
  restricted
    ? <Redirect to={{ pathname: redirectPath, state: { from: match.url } }}/>
    : <Component {...rest}/>
)

// Component factory function to 
const makeSwitchRoute = (SwitchComponent) => ({ path, component: RenderComponent, ...rest }) => (
  <Route path={path} {...rest} render={props => <SwitchComponent component={RenderComponent} {...props}/>}/>
)

// Create route with auth restriction
const RedirectLoginSwitch = (props) => <RestrictedSwitch redirectPath="/login" {...props}/>
const mapStateToAuthProps = ({auth: { isAuthed }}) => ({ restricted: !isAuthed })
const ConnectedAuthSwitch = connect(mapStateToAuthProps)(RedirectLoginSwitch)
const AuthRestrictedRoute = makeSwitchRoute(ConnectedAuthSwitch)

const RedirectProtectedSwitch = (props) => <RestrictedSwitch redirectPath="/protected" {...props}/>
const mapStateToNoAuthProps = ({auth: { isAuthed }}) => ({ restricted: isAuthed })
const ConnectedNoAuthSwitch = connect(mapStateToNoAuthProps)(RedirectProtectedSwitch)
const NoAuthRestrictedRoute = makeSwitchRoute(ConnectedNoAuthSwitch)

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
          <li> <Link to="/login">Login Page</Link> </li>
        </ul>
        <Route exact={true} path="/" component={Public}/>
        <AuthRestrictedRoute path="/protected" component={Protected}/>
        <NoAuthRestrictedRoute path="/login" component={ConnectedLogin}/>
      </div>
    </Router>
  </Provider>)
}
