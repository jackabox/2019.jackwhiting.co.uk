---
title: Handling Redirects in Nuxt.js through Middleware
slug: handling-redirects-in-nuxtjs-through-middlware
date: 2019-09-16 14:42:00
description: 'We can utilise the serverMiddlware provided out of the box with Nuxt.js to read a JSON file and handle the redirects for our application.'
tags:
  - vuejs
  - nuxt
  - seo
---

I recently published an article about [how to handle redirects in Laravel](/posts/handling-seo-redirects-in-a-laravel-application/), since I also use [Nuxt.js](https://nuxtjs.org/) I thought it would be good to write up how to handle redirects simplistically through pure Nuxt (no server, no advanced configuration).

To do this we'll need to leverage the **serverMiddleware**, you can learn more about this [from the official Nuxt.js docs](https://nuxtjs.org/api/configuration-servermiddleware), but in short, it allows for us to handle additional routes that aren't defined within the folder structure (for example an API). In our case, we will be using the serverMiddleware to read the redirects and take us to the appropriate route.

We are going to create a JSON file to hold all of our redirects and then let the middleware read the start destination and send us to the final destination.

### Create JSON

Create a new JSON file in your project and place it in your desired location. For this example, place the file in the following destination `/data/redirects.json`.

Our JSON should contain an array of elements with a `from` and `to`, please see the below example and adjust this to your own needs.

```json
[
  {
    "from": "/",
    "new": "/home"
  },
  {
    "from": "/get-in-touch",
    "to": "/contact"
  }
]
```

### Create the serverMiddleware

Next, we need to create a file which can handle the reading of the JSON and the logic to handle the redirect. Create a new file in `/serverMiddleware/redirects.js` with the following code:

```js
const redirects = require('../data/redirects.json') // update to your file path

export default function(req, rest, next) {
  // find the redirect if it exists where the from === the requested url
  const redirect = redirects.find(r => r.from === req.url)

  // If it exists, redirect the page with a 301 response else carry on
  if (redirect) {
    res.writeHead(301, { Location: redirect.to })
    res.end()
  } else {
    next()
  }
}
```

The above file checks that the URL exists and if so, redirects to the destination. If not, the Nuxt application will move on and return the requested page.

### Add to Nuxt.config.js

Before anything will work, we need to add the newly created redirects middleware into the `nuxt.config.js` . Edit the `nuxt.config.js` file and add the following in:

```
...
serverMiddleware: [
	'~/serverMiddleware/redirects.js'
],
...
```

Recompile the code and check that everything is working.

#### Bonus

If you need to take the redirects a bit further or if you don't mind using third party packages there is an awesome package available at [https://github.com/nuxt-community/redirect-module](https://github.com/nuxt-community/redirect-module) that can handle this for you.
