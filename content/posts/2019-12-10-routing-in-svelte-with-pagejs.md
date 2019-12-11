---
title: 'Setting up Routing In Svelte with Page.js'
slug: 'setting-up-routing-in-svelte-with-pagejs'
date: 2019-12-10T16:00:00
description: 'In Part 2 of our series on Working with Svelte we are going to take a look at how to implement basic routing into our Svelte application by leveraging Page.js. We will then go onto talk about further ways in which we can expand this router for authentication and passing page parameters.'
summary: 'In this article we cover integrating a router into Svelte by leveraging Page.js and dig into examples of authentication and API requests.'
categories:
  - Svelte
series:
  - 'Working with Svelte'
---
<div class="rounded-lg p-8 bg-site-orange mb-10">
  <p>This article is part of a series of posts about Working with Svelte. The topics and articles we have (or will) cover are as follows:</p>
  <ol>
    <li><a class="no-underscore no-hover font-semibold" href="/posts/setting-up-svelte-and-integrating-tailwind-css">Setting up Svelte & Installing Tailwind CSS and PostCSS</a></li>
    <li>Setting up Routing with Page.js (Current Article)</li>
    <li>Optimising Our Router For Large Applications (Coming Soon)</li>
    <li><i>.. and more</i></li>
  </ol>
</div>

In the last article we briefly looked at spinning up Svelte. This article doesn't require you to have done this but if you don't have a Svelte installation I really advise following the [quick start guide](https://svelte.dev/blog/the-easiest-way-to-get-started) on the Svelte website.

There are several ways we can look at routing in Svelte, the first choice may be [Sapper](https://sapper.svelte.dev/) (which is in beta at the point of writing this post) which is a mini-framework built by the Svelte team. There are also a couple of packages which you can use to integrate routing such as **[svelte-routing](https://github.com/EmilTholin/svelte-routing)** or **[Page.js](https://visionmedia.github.io/page.js/)**. 

For the purpose of routing within our application we are going to be utilising the awesome library [Page.js](https://visionmedia.github.io/page.js/). We have chosen Page.js as it offers a lot of granular control over our individual routes and works off any anchor (`<a>`) links in our site without requiring any custom components. I find this works a lot better as when content is rendered from a WYSIWYG or Markdown files all of the internal anchor links will work flawlessly.

## Setting Up Our Environment

To start, we need to install Page.js. Open up your terminal in your root directory of your site and run the following:

```
yarn add page # or npm install page
```

We'll also need to make a tweak to our **package.json** file to ensure that if we reload on a page we have navigated to, for example _/blog_, we will not receive a server error and it will load the appropriate route. Open up your **package.json** and edit the following line:

```js
"start": "sirv public"
```

To append the `--single` option, as so.

```js
"start": "sirv public --single"
```

This should set up everything so we bump into as few errors as possible later on.

# Writing the Router

When we look at how we will integrate Page.js into Svelte, I want to explain a few bits about how things work and show a few examples. Page.js is a extremely extensible so you can perform a lot of logic on a per route basis.

## Setup the Router

At the top of the `App.svelte` file include the router from the Page.js package. We'll also want to create a new file for our Home route so create a new file in the following location `routes/Home.svelte`.

```js
<script>
  import router from "page"
  
  // Include our Routes
  import Home from './routes/Home.svelte'
</script>
```

Make sure you populate the `routes/Home.svelte` file with some dummy text so you can distinguish if it has loaded the route, something like so:

```html
<h1>Home Page</h1>
```

Next, back in our `App.svelte` file we will need to create a couple of variables that we will pass through to the child components and tell Svelte what route to load.

```js
<script>
  ... 

  let page
  let params
</script>
```

To get Page.js to watch, and change the component, based on the URL we are on, we will need to call the `router` package. We can do this by passing the URL as the first property and then our function (to update the component) as the second property. 

```js
// Set up the pages to watch for
router('/', () => page = Home)
``` 

In the above code, we are watching for any requests to the root of our site at "/" and then setting the `page` variable to the `Home` component we imported earlier from the `./routes/Home.svelte` file.

We then need to make sure the router is always watching for changes, which we can do by running `router.start()`. This will look like the following:

```js
// Set up the router to start and actively watch for changes
router.start()
```

Finally, to get the router to load the correct component we can utilise [`svelte:component`](https://svelte.org) which will allow us to recreate and destroy the component on any page load (meaning that a different Route will load when you navigate to any anchors/ the browser history changes). After the closing `</script>` tag add the following:

```html
<svelte:component this={route} params={params} />
```

Your `App.svelte` should look something similar to the following when all put together.

```html
<script>
  import router from "page"
  
  // Include our Routes
  import Home from './routes/Home.svelte'
  
  // Variables
  let page
  let params
  
  // Set up the pages to watch for
  router('/', () => page = Home)

  // Set up the router to start and actively watch for changes
  router.start()
</script>

<svelte:component this={route} params={params} />
```

If you run `yarn dev` from the root directory of your application, you should now see the Home Page load and display any content you added to the `Home.svelte` file.

## Expanding On Our Router

To get our router to actually route things, we will need to set up a couple more instances of routes and add them to our code. Create a two new files in the **routes** directory for `Blog.svelte` and `SingleBlog.svelte`.

### Blog.svelte

Do not worry if you do not fully understand everything that's going on here. I've included a bit of dummy code in the example for `Blog.svelte` as I wanted to show how we can dynamically load content based on route parameters. To summarise what is going on - we utilise the `onMount` from Svelte to fetch a list of JSON blog posts from a dummy API and then loop over them all and display a link to each individual item.

```html
<script>
  import { onMount } from 'svelte'

  const apiUrl = 'https://jsonplaceholder.typicode.com/posts/'
  let data = []

  onMount(async () => {
    const response = await fetch(apiUrl)
    data = await response.json()
  });
</script>

<h1>Blog</h1>

{#each data as item }
  <div>
    <h5><a href="/blog/{item.id}">{item.title}</a></h5>
  </div>
{/each}
```

### SingleBlog.svelte

For the single blog route, we are going to lean on the `params` variable we set up in `App.svelte` and then fetch a single post from the dummy API with that ID.

```html
<script>
  import { onMount } from 'svelte'

  export let params

  const apiUrl = 'https://jsonplaceholder.typicode.com/posts/'
  let data = []

  onMount(async () => {
    const response = await fetch(apiUrl + params.id)
    data = await response.json()
  });
</script>

<h1>{data.title}</h1>
<p>{data.body}</p>
```

### Modifying Our Original Code

Now we have the two new files created, we will need to go back and edit our `App.svelte` to include them. Open the file and import the two new routes.

```js
import Blog from "./routes/Blog.svelte"
import SingleBlog from "./routes/SingleBlog.svelte"
```

Add two new instances of the `router` so that we can watch for the new pages. To watch for the user visiting _/blog_ add the following:

```js
router('/blog', () => page = Blog);
```

When adding a dynamic route, we are presented with another property to `router()` which allows us to load or manipulate any data before we pass through to the route endpoint. We will utilise this in our code so that we can ensure we pass through any query parameters to our end component. 

Add the following code beneath the other instances of `router()`:

```js
router(
  '/blog/:id', 
  
  // Before we set the component
  (ctx, next) => {
  	params = ctx.params
  	next()
  }, 

  // Finally set the component
  () => route = SingleBlog
);
```

In this code we have another function in the middle which allows us to pass through both `ctx` (context) and a `next` function call. In this example, we are assigning the `params` defined in our URL to the `params` variable in the code before proceeding with updating the route component.

If you look back at the code for the `routes/SingleBlog.svelte` file, you will see we used these params to allow us to get the ID of the post we are visiting from the remote API.

To actually be able to navigate to these routes, we need to add a bit of boilerplate to our application, update the code after the closing `</script>` tag in the `App.svelte` file to the following:

```html
<nav>
  <a href="/">Home</a>
  <a href="/blog">Blog</a>
</nav>

<main>
 <svelte:component this={route} params={params} />
</main>
```

Our `App.svelte` file should now look a little like this:

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
    () => route = SingleBlog
  );

  // Set up the router to start and actively watch for changes
  router.start()
</script>

<nav>
  <a href="/">Home</a>
  <a href="/blog">Blog</a>
</nav>

<main>
 <svelte:component this={route} params={params} />
</main>
```

Test it out in your browser and you should see everything working without any page reloads or errors.

## Further Examples

There is lots you can do by utilising Page.js and Svelte together. Although I feel this article is getting a little lengthy, I did want to cover over a few points which may come in super handy for anyone building a more complex application.

### Authentication

We can utilise the `router()` to check if there is a user variable stored, or if the user is authenticated, and then if not redirect to a login page. This is super useful for creating a locked down dashboard.

```html
<script>
  ...
  import AuthedRoute from 'routes/AuthedRoute.svelte' 
  import Login from 'routes/Login.svelte'

  let user = null // any logic you have for getting the user here, or more to come on this later.
  
  router("/login", () => page = Login)
  router('/private', () => {
    // If the user is not set, redirect to login 
  	if (! user) {
  	  router.redirect('/login')
 	}

  	page = PrivateRoute
  })
  ...
</script>
```

### Catch all pages/Error Pages

What happens when a user hits a page where we don't have a route set up? Well, currently they would see a mostly blank page. We can catch this by setting up a wildcard on the `router()` and show an error route instead.

```html
<script>
  ...
  import ErrorPage from "./routes/ErrorPage.svelte"
  
  router('/*', () => route = Error)
  ...
</script>
```

## Conclusion

There is a lot of content in this article discussing the ways to implement Page.js into Svelte to create a dynamic router and I hope it has been useful. The way we have structured our document is not the cleanest at the moment as it will mean we have to repeat a lot of logic within our `router()` calls and in the main `App.svelete` file. In a future article I want to talk about how we can refactor this and set up the routes a bit more efficiently.
