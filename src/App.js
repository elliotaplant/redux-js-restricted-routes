import React from 'react'
import {connect, Provider} from 'react-redux'
import {compose} from 'redux'
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom'
import store from './redux/store'
import {logInUser, logOutUser} from './redux/actions'
import AuthIndicator from './components/AuthIndicator'
import AuthButton from './components/AuthButton'
import {Public, Protected} from './components/pages'

// Login page that redirects to to history
const Login = ({ logInUser }) => (
  <div>
    <p>You must log in to view the page</p>
    <button onClick={logInUser}>Log in</button>
  </div>
)

// Gives the login button ability to
const ConnectedLogin = connect(null, { logInUser })(Login)

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




// export default function AuthExample() {
//   return (<Provider store={store}>
//     <Router>
//       <div>
//         <AuthButton/>
//         <ul>
//           <li> <Link to="/">Public Page</Link> </li>
//           <li> <Link to="/protected">Protected Page</Link> </li>
//           <li> <Link to="/secret">Secret Page</Link> </li>
//           <li> <Link to="/login">Login Page</Link> </li>
//           <li> <Link to="/signup">Signup Page</Link> </li>
//         </ul>
//         <Route exact={true} path="/" component={Public}/>
//         <AuthRestrictedRoute path="/protected" component={Protected}/>
//         <AuthRestrictedRoute path="/secret" component={Secret}/>
//         <NoAuthRestrictedRoute path="/login" component={ConnectedLogin}/>
//         <NoAuthRestrictedRoute path="/signup" component={Signup}/>
//       </div>
//     </Router>
//   </Provider>)
// }

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div style={{ padding: '20px' }}>
          <AuthIndicator />
          <AuthButton />
          <ul>
            <li><Link to="/public">Public Page</Link></li>
            <li><Link to="/protected">Protected Page</Link></li>
          </ul>
          <Route path="/public" component={Public}/>
          <Route path="/protected" component={Protected}/>
        </div>
      </Router>
    </Provider>
  )
}
