---
title: 'Optimising Our Router Within Svelte'
slug: 'optimising-our-router-within-svelte'
date: 2020-01-15T16:00:00
description: 'descert'
summary: 'Summary'
categories:
  - Svelte
series:
  - 'Working with Svelte'
---
Last time we covered setting up Svelte with Page.js and the basics of using the router class throughout our application. In this article, we aim to cover how to optimise and future proof our code and reduce the amount of overhead we need to write for every page we add. This is mostly just to show you an alternative to writing a new router for each route (however, that is also perfectly fine).

At the end of our last guide, we ended up with code similar to the following:

```html
<script>
  import router from "page"
  
  // Include our Routes
  import Home from "./routes/Home.svelte"
  import Blog from "./routes/Blog.svelte"
  import SingleBlog from "./routes/SingleBlog.svelte"
  
  // Variables
  let page
  let params
  
  // Set up the pages to watch for
  router('/', () => page = Home)
  router('/blog', () => page = Blog)
  router(
    '/blog/:id', 
    (ctx, next) => {
     params = ctx.params
     next()
    }, 
    () => page = SingleBlog
  );

  // Set up the router to start and actively watch for changes
  router.start()
</script>

<nav>
  <a href="/">Home</a>
  <a href="/blog">Blog</a>
</nav>

<main>
 <svelte:component this={page} params={params} />
</main>
```

We'll expand a bit on the above and refactor it to clean up and provide reusability to our code.

## Create an Array of Routes and Components

We previously stored our routes in a folder called `routes`. To start, let us create a new file in `routes/index.js`. 

At the top of the file import all of the routes we want to work with. We'll need these to make sure our app can work out what page to load.

Next, we will create an array of all of the routes we want to define and export them so we can pull them back into our main `App.svelte` file. We will do this by defining a path, the component to load and an optional field of auth (in this example, we'll just pass a true or false here).

Our file should look something like the following:

```js
import Home from "./Home.svelte"
import Blog from "./Blog.svelte"
import SingleBlog from "./SingleBlog.svelte"
import PrivateRoute from "./PrivateRoute.svelte"
import Login from './Login.svelte'
import Error from "./Error.svelte"

export default [
  {
    path: '/',
    component: Home
  }, {
    path: '/blog',
    component: Blog
  }, {
    path: '/blog/:id',
    component: SingleBlog
  }, {
    path: '/private',
    component: PrivateRoute,
    auth: true
  }, {
    path: '/login',
    component: Login
  }, {
    path: '*',
    component: Error
  }
]
```

Update our App.svelte to remove the redundant code and fetch the routes from our `routes/index.js` file. It should look like the following:

```html
<script>
  import router from "page"
  import routes from './routes'
  
  // Variables
  let page
  let params
  
  // Set up the pages to watch for
  router('/', () => page = Home)
  router('/blog', () => page = Blog)
  router(
    '/blog/:id', 
    (ctx, next) => {
     params = ctx.params
     next()
    }, 
    () => page = SingleBlog
  );

  // Set up the router to start and actively watch for changes
  router.start()
</script>

<nav>
  <a href="/">Home</a>
  <a href="/blog">Blog</a>
</nav>

<main>
 <svelte:component this={page} params={params} />
</main>
```

## Looping Around Our Routes

In our initial script, we are having to initialise each route individually which is cumbersome let us refactor the routes so that we can loop around and automatically instantiate them.

```js
let user = false;

routes.forEach(route => {
  router(
    route.path, 
    
    // pass the params
    (ctx, next) => {
      params = ctx.params
      next()
    },
    
    // handle the auth
    () => {
      if (route.auth && ! user) {
        router.redirect('/login')
      } else {
        page = route.component
      }
    }
  )
})
```

To explain the above code a little, firstly we loop around all the routes we defined in the `routes/index.js`. We then set the path, pass through any variables to the route and also do a basic check to see if authentication is required and if the user is logged in. Finally, we either redirect or set the page attribute to the component defined and load it on our page.

If we want to add more routes in the future we can just edit the `routes/index.js` file with a new component and array child.

Want to see this in action? Check out the codesandbox below.

<iframe src="https://codesandbox.io/embed/polished-dew-pckm7?fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="polished-dew-pckm7" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
