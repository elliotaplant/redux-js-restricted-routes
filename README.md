# Making Restricted Routes with Redux, React, and React Router v4
Often times we need to hide certain parts of our web apps from users who aren't properly authenticated. The hidden content might be something the user hasn't paid for, like movies on Netflix, or it might be content that is impossible to display without knowing who the user is, like the a profile page. Sometimes we'll even restrict content *because* the user is logged in. It wouldn't make sense to go to the login page if we are already logged in, would it?

In complex applications, we might restrict content based on tiered authorization levels. A basic user shouldn't have access to the admin panel, but an admin should be able to view everything. In even *more* complex applications, we could restrict content based on an a set of access permissions. A designer might be allowed to edit code, and an engineer might not be allowed to edit designs.

All of these restrictions are based on the authentication state of our application. If we're using Redux, that state should be in our application's Redux-store. Wouldn't it be cool if we could make our application automatically restrict users from accessing content based on their authorization state in our redux store?

## #CodeGoals
We want to make React components that act like React Router's `<Route />` component but are connected to our Redux store and redirect users to a safe place if they try to access restricted content.

By the end of the post, we'll be able to write JSX code like this:

```javascript
<Router>
  ...
  <AuthRestrictedRoute path="/protected" component={Protected}/>
  <NoAuthRestrictedRoute path="/login" component={Login}/>
  ...
</Router>
```

Where the `Protected` component located at `/protected` in `<AuthRestrictedRoute />` is only available to users who are logged in. Conversely the `Login` component at `/login` in `<NoAuthRestrictedRoute />` is only available to users who are *not* logged in. I'll cover the more advanced cases like admin levels and feature based authorization in future blog posts, but those posts will be based on the code we write in this tutorial.

## What You Know

To get the most out of this tutorial, you should have some basic familiarity with React, Redux, and React Router v4.

React Training has an example of [authentication with React Router v4](https://reacttraining.com/react-router/web/example/auth-workflow), but I highly recommend checking out [Tyler McGinnis's tutorial](https://tylermcginnis.com/react-router-protected-routes-authentication/) on building that example. His video is especially helpful, and we'll start about where his tutorial leaves off.

To learn the basics of Redux with React, take a read over [this tutorial](https://hackernoon.com/a-basic-react-redux-introductory-tutorial-adcc681eeb5e) by Miguel Moreno. The concepts we'll use here are `connect` and `mapStateToProps`.

## TL;DR

The final code from this tutorial is available at the bottom of the page and on [my github](https://github.com/elliotaplant/redux-js-restricted-routes).

## Setup

Fire up `create-react-app` to create a new project folder called `redux-restricted-routes`:
```bash
create-react-app redux-restricted-routes
cd redux-restricted-routes
```
If you haven't used `create-react-app` before, install it with `npm install -g create-react-app`.

Once we're in the project, we should be able to run
```
yarn start
```
If you see the default 'Create React App' screen in your web browser, you're on the right track!

![Create React App default screen](https://i.imgur.com/zxmSYrX.png "Create React App default screen")

## Initializing Redux

The first thing we'll add to our project is Redux to manage the logged in/out state. Go ahead and run
```bash
yarn add redux
```

In the `src` folder lets create a directory called `redux` and a file called `actions.js` in the new folder, then let's add these two action types to the `actions.js` file:

```javascript
// src/redux/actions.js

// Action Types
export const LOG_IN_USER = 'LOG_IN_USER'
export const LOG_OUT_USER = 'LOG_OUT_USER'
```

Since the only state we care about is whether the user is logged in or not, these are the only actions we need.

To make things easier for our future selves, lets make some action creator functions to facilitate the logging in/out process and add them to the `src/redux/actions.js` file:
```javascript
// src/redux/actions.js

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

```

In order to handle those actions, we'll need a reducer. Next to your `actions.js` file in `src/redux`, create a `reducers.js` file with this auth reducer:
```javascript

// src/redux/reducers.js

import {LOG_IN_USER, LOG_OUT_USER} from './actions'

// Reducer for handling auth actions
export function authReducer(state = { isAuthed: false }, action) {
  switch (action.type) {
    case LOG_IN_USER:
      return {
        ...state,
        isAuthed: true
      }
    case LOG_OUT_USER:
      return {
        ...state,
        isAuthed: false
      }
    default:
      return state
  }
}
```

All this reducer does is update the `isAuthed` part of our state when it sees the `LOG_IN_USER` and `LOG_OUT_USER` actions.

Finally, lets use this reducer to make a store. Create a `store.js` file in the `src/redux` folder and initialize the store with our reducer.

```javascript
// src/redux/store.js

import {combineReducers, createStore} from 'redux';
import {authReducer} from './reducers'

const reducers = combineReducers({
  auth: authReducer,
})

const store = createStore(reducers)

export default store
```

This file uses the `createStore` methods of redux to make a Redux store out of our auth reducer. Using `combineReducers` function is overkill here, but in your future apps, you'll probably have more than one reducer.

We'll export this store so that we can connect it to redux with the `react-redux` package.

## Connecting Redux to React

Luckily for us, the `react-redux` npm package will do all the heavy lifting we need to make our React app aware of our Redux store. Add the package to your project by running:
```bash
yarn add react-redux
```

This package gives us the `Provider` component that lets components within our app access our store. Replace the contents of your `App` component with this simplified JSX:

```javascript
// src/App.js

import React from 'react'
import {Provider} from 'react-redux'
import store from './redux/store'

export default function App() {
  return (
    <Provider store={store}>
      <h1>Hello World!</h1>
    </Provider>
  )
}
```

Nothing magical is happening here, but if you go to your web browser you should see Hello world popping up:

![Hello World!](https://i.imgur.com/SekaVmU.png)

Now lets get some indication of our logged in status. Make a `src/components` folder then create a file called `AuthIndicator.js` with this JSX component:

```javascript
// src/components/AuthIndicator.js

import React from 'react'

const AuthIndicator = ({isAuthed}) =>(
  isAuthed
    ? <p>Welcome! You are logged in</p>
    : <p>You are not logged in. Please log in to view protected content</p>
)
```

This component just takes one prop and tells us whether we are logged in or not. In order to connect this component to our Redux store, we use `react-redux`'s `connect` method, which can accept a `mapStateToProps` function. This function lets us decide how we want to tell our component about changes in the Redux store, and has the added benefit of preventing re-renders if the portion of state we pass to our component hasn't changed.

```javascript
// src/components/AuthIndicator.js

import React from 'react'
import {connect} from 'react-redux'

const AuthIndicator = ({isAuthed}) =>(
  isAuthed
    ? <p>Welcome! You are logged in</p>
    : <p>You are not logged in. Please log in to view protected content</p>
)

const mapAuthStateToProps = ({auth: { isAuthed }}) => ({isAuthed})

export default connect(mapAuthStateToProps)(AuthIndicator)
```

Now that our AuthIndicator knows about our redux store, lets add it to the app:
```javascript
// src/App.js

import React from 'react'
import {Provider} from 'react-redux'
import store from './redux/store'
import AuthIndicator from './components/AuthIndicator'

export default function App() {
  return (
    <Provider store={store}>
      <AuthIndicator />
    </Provider>
  )
}
```

Checking out our browser, we see a wonderful un-welcome message:

![Unwelcome](https://i.imgur.com/y12Fvgf.png)

Perfect! The app knows that we aren't logged in. Lets add a way to change that.

Create a `src/components/AuthToggle.js` file to create a sign in/out button:
```javascript
// src/components/AuthToggle.js

import React from 'react'
import {connect} from 'react-redux'
import {logInUser, logOutUser} from '../redux/actions'

const AuthToggle = ({isAuthed, logInUser, logOutUser}) =>(
  isAuthed
    ? <button onClick={logOutUser}>Sign Out</button>
    : <button onClick={logInUser}>Sign In</button>
)

const mapStateToProps = ({auth: {isAuthed}}) => ({isAuthed})
const mapDispatchToProps = {logInUser, logOutUser}

export default connect(mapStateToProps, mapDispatchToProps)(AuthToggle)
```

Note that the AuthToggle component is very similar to AuthIndicator, except that it accepts `logInUser` and `logOutUser` methods as props. These are the action creator methods we defined in our `actions.js` file. The `connect` method allows us to take these two action creators 
