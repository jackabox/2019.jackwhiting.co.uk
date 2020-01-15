---
title: 'Optimising Our Svelte Router (for More Sanity)'
slug: 'optimising-our-router-in-svelte'
date: 2019-12-17T16:00:00
description: ''
summary: ''
draft: true
categories:
  - Svelte
series:
  - 'Working with Svelte'
---


# Create Route File

- in `routes/index.js`. 
- Add all our imports, making them relative to current directory
- create an array with the Paths of each route, and the component to load. We've also added an optional "Auth" param (which you don't have to use but will come in handy for some)

```js
import Home from "./Home.svelte"
import Blog from "./Blog.svelte"
import SingleBlog from "./SingleBlog.svelte"
import Private from "./Private.svelte"
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
    component: Private,
    auth: true
  }, {
    path: '/login',
    component: Login
  },
  {
    path: '*',
    component: Error
  }
]

```

# Update App.svelte

- remove all the excess `router()` calls and we'll replace it with one handy function
- split up into basics without auth, then we can do a section on adding auth later on yo!

```html
<script>
  import { user } from './store.js'
  import routes from './routes'
  import router from "page"

  let page
  let params

  // Iterate through the routes
  routes.forEach(route => {
    router(
      route.path, 
      
      (ctx, next) => {
        params = ctx.params
        next()
      },

      () => {
        if (route.auth && ! $user) {
          router.redirect('/login')
        }
        
        page = route.component
      }
    )
  })

  // Start the router
  router.start()
</script>
```

## store.js

```js
// Let's store this as a global for the site.
import { readable } from 'svelte/store'

// And we can set a default value here - note we'll use Firebase later on to set this as a value and check if they are logged in or not.
export const user = readable(0, set => {
	set(true)
})
```

# Codepen
