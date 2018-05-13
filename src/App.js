import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'

// Fake authentication that we dont need?
const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

// Pages to display
const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

// Login page that redirects to to history
class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }))
    })
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
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

// Old private rout
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
)

// New private route with restricted prop
const RestrictedRoute = ({ component: Component, restricted, redirectPath, ...rest }) => (
  <Route {...rest} render={(props) => (
    restricted
      ? <Component {...props} />
      : <Redirect to={{
          pathname: redirectPath,
          state: { from: props.location }
        }} />
  )} />
)


// Create route with auth restriction
const RedirectLoginRoute = (props) => <RestrictedRoute redirectPath="/login" {...props}/>
const mapStateToAuthProps = (state) => ({ restricted: !state.isAuthed });
const AuthRestrictedRoute = connect(mapStateToAuthProps)(RedirectLoginRoute);

const RedirectProtectedRoute = (props) => <RestrictedRoute redirectPath="/protected" {...props}/>
const mapStateToNoAuthProps = (state) => ({ restricted: state.isAuthed });
const NoAuthRestrictedRoute = connect(mapStateToNoAuthProps)(RedirectProtectedRoute);

// Button to log you in if you aren't
const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

export default function AuthExample () {
  return (
    <Router>
      <div>
        <AuthButton/>
        <ul>
          <li><Link to="/public">Public Page</Link></li>
          <li><Link to="/protected">Protected Page</Link></li>
        </ul>
        <Route path="/public" component={Public}/>
        <NoAuthRestrictedRoute path="/login" component={Login}/>
        <AuthRestrictedRoute path='/protected' component={Protected} />
      </div>
    </Router>
  )
}
