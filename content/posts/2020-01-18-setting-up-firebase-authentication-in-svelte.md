---
title: 'Setting up Firebase Authentication in Svelte 3'
slug: 'setting-up-firebase-authentication-in-svelte'
description: ''
summary: ''
date: 2020-01-20T00:00:00
draft: true
categories:
  - Svelte
series:
  - 'Working with Svelte'
---
Intro to go here to explain the article

## Install Firebase

```bash
yarn add firebase
```

Create a new file `firebase.js` and add the following content to initialise the auth and provider. You'll need to head to [google console]() to get your credentials if you don't already have them.

```js
import firebase from 'firebase/app'
import 'firebase/auth'

let config = {
 	/* Your credentials here */
}

firebase.initializeApp(config)

export const auth = firebase.auth()
export const provider = new firebase.auth.GoogleAuthProvider()

export default firebase
```

## Storing the User object

Create a new store variable, we'll use this throughout the site.

```js
import { writable } from 'svelte/store'

export const user = writable({ loggedIn: false })
```

## Writing Our Authentication Functions

Create a new `auth.js` file.

Import all the necessary files we will need. These are the auth and provider from the `firebase.js` file, the user from the `store.js` and the `router()` to handle redirects.

```js
import { auth, provider } from './firebase.js'
import { user } from './store.js'
import router from 'page'
```

### Handling Registration

In our `auth.js` add the following

```js
export const handleRegisterForm = async ({ target }) => {
	try {
		const result = await auth.createUserWithEmailAndPassword(
			target.email.value, 
			target.password.value
		)

    let { email, displayName, photoURL } = result.user

    user.set({
      loggedIn: true, 
      email,
      displayName,
      photoURL
    })

    router.redirect('/dashboard')
  } catch (error) {
	  	console.warn(error.message)
  }
}
```

To explain our function, we will pass through the form details the user has entered from the `Register.svelte`. Next, we create a user with the email and password.

Once the user has been created, we grab the email, display name, and photo of the user and set the value of the `user` to them.

After everything, we redirect to the dashboard.

### Handling Login

```js
export const handleLoginForm = async ({ target }) => {
	try {
		const result = await auth.signInWithEmailAndPassword(
			target.email.value, 
			target.password.value
		)
   
    let { email, displayName, photoURL } = result.user

    user.set({
      loggedIn: true, 
      email, 
      displayName,
      photoURL
    })

    router.redirect('/dashboard')
	} catch (error) {
		console.warn(error.message)
	}
}
```

### Handling Login/Register with Google Popup

```js
export const handleGoogleLogin = async () => {
	try {
		const result = await auth.signInWithPopup(provider)
     
    let { email, displayName, photoURL } = result.user

    user.set({
      loggedIn: true, 
      email, 
      displayName,
      photoURL
    })

    router.redirect('/dashboard')
  } catch (error) {
	  	console.warn(error.message)
  }
}
```

### Handling Logout

```js
export const handleLogOut = async () => {
	try {
		const result = await auth.signOut()
		
		user.set({
			loggedIn: false
		})
	} catch (error) {
	  	console.warn('error on logout', error.message);
	}
}
```

## Create the Routes

If you have followed along with my previous articles (which I recommend) we will need to update our routes so we can show the register and login components.

Update our routes with the necessary routes.

```js
import Login from './pages/Auth/Login.svelte'
import Register from './pages/Auth/Register.svelte'
import Dashboard from './pages/Dashboard.svelte'

export default [
	...
	{
		path: '/dashboard',
		component: Dashboard,
		auth: true
	}, {
		path: '/login',
		component: Login
	}, {
		path: '/register',
		component: Register
	}
	...
]
```

Populate the `Login.svelte` file with a simple login form.

```html
<script>
  import { handleLoginForm, handleGoogleLogin } from './../../auth.js'
</script>

<h2>Login</h2>

<form on:submit|preventDefault={handleLoginForm}>
  <div>
    <label for="email">Email</label>
    <input type="email" name="email" id="email">
  </div>

  <div>
    <label for="password">Password</label>
    <input type="password" name="password" id="password">
  </div>

  <button type="submit">Login</button>
</form>

<button on:click={handleGoogleLogin}>Google</button>
```

Populate the `Register.svelte` with a register form.

```html
<script>
  import { handleRegisterForm, handleGoogleLogin } from './../../auth.js'
</script>

<h2>Register</h2>

<form on:submit|preventDefault={handleRegisterForm}>
  <div>
    <label for="email">Email</label>
    <input type="email" name="email" id="email">
  </div>

  <div>
    <label for="password">Password</label>
    <input type="password" name="password" id="password">
  </div>

  <button type="submit">Register</button>
</form>

<button on:click={handleGoogleLogin}>Google</button>
```

## Update our App.svelte

Update our `App.svelte` to import the Store user and the Logout function.

```js
import { user } from './store.js'
import { handleLogOut } from './auth.js'
```

Update our routes function to check if the `$user` is logged.

```js
// Iterate through the routes
routes.forEach(route => {
	router(
		route.path, 
		(ctx, next) => {
			params = ctx.params
			next()
		},
		() => {
			if (route.auth && ! $user.loggedIn) {
				router.redirect('/login')
			} else {
				page = route.component
			}
		}
	)
})
```

Create a check for the the user is logged in and show the dashboard and logout button. Otherwise, we will show the login and register links.

```html
<nav>
	<a href="/">Home</a>
	<a href="/blog">Blog</a>
    
	{#if $user.loggedIn}
    	<a href="/dashboard">Secret Page</a>
    	<a href="/" on:click={handleLogOut}>Logout</a>
	{:else}
    	<a href="/login">Login</a>
    	<a href="/register">Register</a>
  {/if}
</nav>
```
