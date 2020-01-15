---
title: 'Refactoring and Optimising Our Router Within Svelte'
slug: 'refactoring-our-router-within-svelte'
date: 2020-01-15T16:00:00
description: 'In Part 2 of the series on Working with Svelte, We are going to take a look at how to improve our router (implemented with Page.js) and refactor the code to provide a more solid approach. We will also set up our application to easily add in new routes.'
summary: 'In this article we take a look at how to improve our router and refactor the code to provide a more solid approach'
categories:
  - Svelte
series:
  - 'Working with Svelte'
---
In the last article we covered integrating Page.js with our Svelte application to set up routing, along with a bit of an explanation in the ways of which we could use it. In this article, I want to cover how to improve our router and refactor the code to provide a more solid approach. If you haven't read the [last article](https://jackwhiting.co.uk/posts/setting-up-routing-in-svelte-with-pagejs/) I highly suggest having a read through to ensure you get the most from this one.

At the end of the last article, you should have ended up with something that looks similar to the following.

```html
<script>
  import router from "page"
  
  // Include our Routes
  import Home from "./pages/Home.svelte"
  import Blog from "./pages/Blog.svelte"
  import Article from "./pages/Article.svelte"
  
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
    () => page = Article
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

In this article we will take the above code, expand on it and add in some simple refactoring.

## Create an Array of Routes and Components

To start, let us create a new file in the route directory which will store our applications routes.

```bash
cd src
touch routes.js
```

At the top of the file import all of the routes we want to work with. We'll need these to make sure our app can work out what page to load.

Next, we will create an array of all of the routes we want to define and export them so we can pull them back into our main `App.svelte` file. We will do this by defining three things:

- The path (the URL we will visit in the browser)
- The component to load and handle the page.
- An optional field to declare whether authentication is required. (in this example, we'll just pass a true or false here).

Our file should look something like the following:

```js
import Home from "./pages/Home.svelte"
import Blog from "./pages/Blog.svelte"
import Article from "./pages/Article.svelte"
import Private from "./pages/Private.svelte"
import Login from './pages/Login.svelte'
import Error from "./pages/Error.svelte"

export default [
  {
    path: '/',
    component: Home
  }, {
    path: '/blog',
    component: Blog
  }, {
    path: '/blog/:id',
    component: Article
  }, {
    path: '/private',
    component: Private,
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

## Updating App.svelte

We need to head back to `App.svelte` and update our code to remove any redundancies and write a method for declaring the routes. Import our array of routes at the top of the file.

```html
<script>
  import router from "page"
  import routes from './routes'
  
  ...
</script>
```

In our initial script, we had to initialise each route manually. This is not too much of a problem if you have a small application but it becomes cumbersome when our application starts to grow. Lets refactor the code to loop around each route from our `routes.js` file and then create a new instance of it. We are reusing code from the last article here but I've left a few comments in incase you haven't read it.

```html
<script>
  ...
  let params;
  let user = false;

  // Loop around all of the routes and create a new instance of
  // router for reach one with some rudimentary checks.
  routes.forEach(route => {
    router(
      route.path, 
      
      // Set the params variable to the context.
      // We use this on the component initialisation
      (ctx, next) => {
        params = ctx.params
        next()
      },
      
      // Check if auth is valid. If so, set the page to the component
      // otherwise redirect to login.
      () => {
        if (route.auth && ! user) {
          router.redirect('/login')
        } else {
          page = route.component
        }
      }
    )
  })
  
  ...
</script>
```

To explain the above code a little, firstly we loop around all the routes we defined in the `routes.js`. We create a new instance of `route()` for any paths defined. We pass through any variables such as `id` which were defined in our array. 

Finally, we check to see if authentication is required and if the user object exists. If not valid, we redirect to the login page. If so, we set the page variable to the component and then pass this through.

If we want to add more routes in the future we can simply edit the `routes.js` file with a new component and create a new child in the array and everything should work out of the box.

Want to see this in action? Check out the CodeSandbox below.

<iframe src="https://codesandbox.io/embed/polished-dew-pckm7?fontsize=14&hidenavigation=1&module=%2FApp.svelte&theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="polished-dew-pckm7" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Is there anything else you would have done here to improve on our router?
