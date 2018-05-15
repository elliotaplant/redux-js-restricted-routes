# Making Restricted Routes with Redux, React, and React Router v4
Often times we need to hide certain parts of our web apps from users who aren't properly authenticated. The hidden content might be something the user hasn't paid for, like movies on Netflix, or it might be content that is impossible to display without knowing who the user is, like the a profile page. Sometimes we'll even restrict content *because* the user is logged in. It wouldn't make sense to go to the login page if we are already logged in, would it?

In complex applications, we might restrict content based on tiered authorization levels. A basic user shouldn't have access to the admin panel, but an admin should be able to view everything. In even *more* complex applications, we could restrict content based on an a set of access permissions. A designer might be allowed to edit code, and an engineer might not be allowed to edit designs.

All of these restrictions are based on the authentication state of our application. If we're using Redux, that state should be in our application's Redux-store. Wouldn't it be cool if we could make our application automatically restrict users from accessing content based on their authorization state in our redux store?

## #CodeGoals
We want to make React components that act like React Router's `<Route />` component but are connected to our Redux store and redirect users to a safe place if they try to access restricted content.

By the end of the post, we'll be able to write JSX code like this:

```jsx
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

The final code from this tutorial is available at the bottom of the page and on [my github](https://github.com/elliotaplant/redux-restricted-routes).

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

## Adding Redux

The first thing we'll add to our project is Redux to manage the logged in/out state. Go ahead and run
```bash
yarn add redux react-redux
```

Now lets create a file called `actions.js` in the `src` folder with two actions:

```javascript
// src/actions.js

// Action Types
export const LOG_IN_USER = 'LOG_IN_USER'
export const LOG_OUT_USER = 'LOG_OUT_USER'
```

Since the only state we care about is whether the user is logged in or not, these are the only actions we need.

To make things easier for our future selves, lets make some action creator functions to facilitate the logging in/out process and add them to the `src/actions.js` file:
```javascript
// src/actions.js

// ...

// Action Creators
export function logInUser() {
  return { type: LOG_IN_USER }
}

export function logOutUser() {
  return { type: LOG_OUT_USER }
}

```
