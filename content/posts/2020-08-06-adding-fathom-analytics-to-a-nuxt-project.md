---
title: Adding Fathom Analytics to a Nuxt Project
slug: adding-fathom-analytics-to-a-nuxt-project
description: How to effectively add Fathom Analytics to your Nuxt project and stop it
  tracking on your development environment.
summary: How to effectively add Fathom Analytics to your Nuxt project and stop it
  tracking on your development environment.
date: 2020-08-06T00:00:00Z
categories:
- Nuxt
ogImage: ''
---

If, like me, you have started using [Fathom Analytics](https://usefathom.com/ref/ULVWJ1)[^1] you might be wondering how to add it to your [Nuxt](https://nuxtjs.org) project properly.

The official Fathom docs (at the time of writing this article) involves overwriting the `app.html` file — this can cause issues with deployment and updating your application. Instead, we are going to utilise the [Vue Meta](https://vue-meta.nuxtjs.org/) package to add a script tag to the site.

By default, Vue Meta comes preinstalled when you create a Nuxt application

Open up your `nuxt.config.js` file in your favourite code editor. Look for the section starting with `head`. It might look a little like this if you haven't made any previous changes.

```js
export default {
  // escaped for brevity

  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },

      // hid is used as unique identifier. Do not use `vmid` for it as it will not work
      { hid: 'description', name: 'description', content: 'Meta description' }
    ]
  }

  // escaped for brevity
}
```

Let us update the `nuxt.config.js` file to include the script. We're also going to set some healthy defaults to ensure that we only load the script once and only on the production server.

```js
export default {
  // escaped for brevity

  head: {
    script: [
      {
        hid: 'fathom', // unique identifier
        src: SITE_URL,
        site: SITE_ID,
        spa: 'auto', // set by fathom
        defer: 'defer',
        once: true, // only load once on SSR

        // optional: skip loading script if we aren't in production
        skip: process.env.NODE_ENV !== 'production'
      }
    ]
  }

  // escaped for brevity
}
```

Grab your **Site ID** and **Script URL** from the [Fathom Dashboard](https://app.usefathom.com/#/settings/sites) and replace the `SITE_URL` and `SITE_ID` variables in the code you just added.

Save your config and deploy the changes then watch the traffic coming in.

**Note:** If you want to test everything works you can set `skip` to `false` and you should see the traffic hit your dashboard (note, this can mess up your analytics so potentially test it on a temporary site).

That's everything - enjoy!

[^1]: This link uses a referral code which helps earn me a little money each month if you sign up and continue using Fathom.
