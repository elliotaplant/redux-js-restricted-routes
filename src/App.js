import React from 'react'
import { connect, Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import store from './redux/store'
import { authUser, logOutUser } from './redux/actions'

// Pages to display
const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

// Login page that redirects to to history
class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    // Can we get referrer without this props stuff?
    if (redirectToReferrer === true) {
      return <Redirect to={from} />
    }

    return (
      <div>
        <p>You must log in to view the page</p>
        <button onClick={this.props.authUser}>Log in</button>
      </div>
    )
  }
}

const ConnectedLogin = connect(null, { authUser })(Login)

// Old private rout
// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) => (
//     fakeAuth.isAuthenticated === true
//       ? <Component {...props} />
//       : <Redirect to={{
//           pathname: '/login',
//           state: { from: props.location }
//         }} />
//   )} />
// )

// New private route with restricted prop
const RestrictedRoute = ({ component: Component, restricted, redirectPath, ...rest }) => (
  <Route {...rest} render={(props) => (
    restricted
      ? <Redirect to={console.log('redirectPath', redirectPath) || {
          pathname: redirectPath,
          state: { from: props.location }
        }} />
      : <Component {...props} />
  )} />
)


// Create route with auth restriction
const RedirectLoginRoute = (props) => <RestrictedRoute redirectPath="/login" {...props}/>
const mapStateToAuthProps = ({auth: {isAuthed}}) =>  ({ restricted: !isAuthed })
const AuthRestrictedRoute = connect(mapStateToAuthProps)(RedirectLoginRoute); // why does this need withRouter

const DeepRestrictedLoginRoute = props => <div><div><RedirectLoginRoute {...props} /></div></div>

const RedirectProtectedRoute = (props) => <RestrictedRoute redirectPath="/protected" {...props}/>
const mapStateToNoAuthProps = ({auth: {isAuthed}}) => ({ restricted: isAuthed });
const NoAuthRestrictedRoute = connect(mapStateToNoAuthProps)(RedirectProtectedRoute);

// Button to log you in if you aren't
const AuthButton = connect(({auth: {isAuthed}}) => ({ isAuthed }), { logOutUser })(({ isAuthed, logOutUser }) => (
  isAuthed ? (
    <p>
      Welcome! <button onClick={logOutUser}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

export default function AuthExample () {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <AuthButton/>
          <ul>
            <li><Link to="/public">Public Page</Link></li>
            <li><Link to="/protected">Protected Page</Link></li>
            <li><Link to="/login">Login Page</Link></li>
          </ul>
          <Route path="/public" component={Public}/>
          <AuthRestrictedRoute path="/protected" component={Protected} />
          <NoAuthRestrictedRoute path="/login" component={ConnectedLogin}/>
        </div>
      </Router>
    </Provider>
  )
}
