Why did this not work?
```jsx
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
const RedirectLoginRoute = (props) => <RestrictedRoute redirectPath="/login" {...props}/>
const mapStateToAuthProps = ({auth: {isAuthed}}) =>  ({ restricted: !isAuthed })
const AuthRestrictedRoute = connect(mapStateToAuthProps)(RedirectLoginRoute);
```

But when `withRouter` was added, it did work?
```
- const AuthRestrictedRoute = connect(mapStateToAuthProps)(RedirectLoginRoute);
+ const AuthRestrictedRoute = withRouter(connect(mapStateToAuthProps)(RedirectLoginRoute));
```

Also, everything worked up until the `connect` was added?

Basically, RestrictedRoute and RedirectLoginRoute both returned a `<Route />` element. This Route element was attached to the router and received prop changes when the route changed.

When `connect` was added, AuthRestrictedRoute did not return a `<Route />` element but instead a `Connect(RedirectLoginRoute)` which does not respond to prop changes from the `Router`. Because this element. See diagram on how react calculates re-renders for children.

The `withRouter` HOC gets around this by wrapping the `Connect(RedirectLoginRoute)` with a `<Route />` element, forcing the `Connect(RedirectLoginRoute)` to re-render on route changes.

---

This whole mess can be avoided by putting the `<Route />` on the outside like so:

```jsx
const RestrictedSwitch = ({ match, component: Component, restricted, redirectPath, ...rest }) => (
  restricted
  ? <Redirect to={{ pathname: redirectPath, state: { from: match.url } }}/>
  : <Component {...rest}/>
)
const RedirectProtectedSwitch = (props) => <RestrictedSwitch redirectPath="/protected" {...props}/>
const ConnectedNoAuthSwitch = connect(mapStateToNoAuthProps)(RedirectProtectedSwitch);
const NoAuthRestrictedRoute = ({ path, component: Component, ...rest }) => (
  <Route path={path} {...rest} render={props => <ConnectedNoAuthSwitch component={Component} {...props}/>}/>
);
```

This way, the route is on the outside, so the `NoAuthRestrictedRoute` can respond to changes in the route and let its child, the `connect`ted component, respond to changes in the redux store.
