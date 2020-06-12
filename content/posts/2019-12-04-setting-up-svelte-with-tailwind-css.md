---
title: 'Installing Svelte & Integrating Tailwind CSS (and PostCSS)'
slug: setting-up-svelte-and-integrating-tailwind-css
date: 2019-12-04T01:38:00
description: 'In Part 1 of the series on Working with Svelte we will take a glance at how to set up Svelte 3 from a template and then how to integrate PostCSS, PurgeCSS and Tailwind. You will be able to use this to then expand on any other PostCSS plugins (such as autoprefixer or import).'
summary: 'In the first article we cover setting up Svelte 3 from a sample template and integrating Tailwind CSS with PostCSS.'
categories:
  - Svelte
  - Tailwind
series:
  - 'Working with Svelte'
ogImage: '/img/posts/og-setting-up-svelte-tailwind.jpg'
---

<div class="rounded-lg p-6 lg:p-8 bg-site-orange mb-10">
  <p>This article is part of a series of posts about Working with Svelte. The topics and articles we have (or will) cover are as follows:</p>
  <ol>
    <li><a class="no-underscore no-hover font-semibold inline" href="#">Setting up Svelte & Installing Tailwind CSS and PostCSS</a></li>
    <li><a class="no-underscore no-hover font-semibold inline" href="/posts/setting-up-routing-in-svelte-with-pagejs">Setting up Routing with Page.js</a></li>
    <li><a class="no-underscore no-hover font-semibold inline" href="/posts/refactoring-our-router-within-svelte">Refactoring and Optimising Our Router</a></li>
    <li><i>.. and more</i></li>
  </ol>
</div>

Svelte is an awesome underdog in JavaScript frameworks and is climbing the ranks currently due to the way it compiles your scripts and HTML. Svelte is inherently a compiler and all of your components files get compiled into pure JavaScript. You can find out more about Svelte through their [website](https://svelte.dev/).

## Install Svelte

To get set up with Svelte, we will require the installation of [Node.js](https://nodejs.org/en/) and [Degit](https://github.com/Rich-Harris/degit). I won't cover how to get these set up in this article as it expects a bit of knowledge of Node and the Terminal, you can follow the installation of each at their respective sites beforehand.

Let's create a copy of the base template provided by Svelte, and install all the necessary libraries with the following.

```bash
npx degit sveltejs/template my-svelte-project
cd my-svelte-project

yarn # or npm install
```

To test everything is working properly, we can run `yarn dev` and we should be able to see the default page at [https://localhost:5000](https://localhost:5000). If you can't you may want to ensure nothing went wrong with the setup.

## Set Up Tailwind

I'm a huge fan of Tailwind and use it on most projects, so working with Svelte would be no different. Staying in the directory we installed Svelte into, we will need to install a few dependancies, create a new `postcss.config.js` file and finally modify a couple of existing files.

### Install Dependencies

Install the necessary development dependencies with the following command:

```bash
yarn add --dev postcss postcss-load-config svelte-preprocess tailwindcss
```

If you want to make sure unused styles are removed when in production (keeping our file size lean), you can also add the following dependency.

```bash
yarn add @fullhuman/postcss-purgecss
```

### Generate Tailwind Config

To overwrite the default styles provided by Tailwind, we will need to make sure we have a `tailwind.config.js` in our route directory where we can put our necessary tweaks. You can do this by running the following command.

```bash
npx tailwind init
```

If you open up the file created you should see it looks similar to the below.

```js
module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
```

### Creating our PostCSS Rules

We will need to tell Svelte how to interpret and compile our necessary code. We can do this by creating a `postcss.config.js` file in the route directory. Manually create one or run the following in the terminal.

```bash
touch postcss.config.js
```

Open the file in your favourite editor and copy in the following code.

```js
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.svelte', './src/**/*.html'],
  whitelistPatterns: [/svelte-/],
  defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
});

module.exports = {
  plugins: [require('tailwindcss'), ...(!process.env.ROLLUP_WATCH ? [purgecss] : [])],
};
```

To explain the above a little, we first create a ruleset for Purge CSS which will look through all Svelte and HTML files and remove any classes that do not match what is included. We'll also add a whitelist pattern to ensure that any Svelte generated classes are not removed unnecessarily.

We then watch on whether the `process.env.ROLLUP_WATCH` equates to true, if not, we purge, if true then we are in development and we just compile the Tailwind classes.

### Integrating with Svelte

We'll need to include the Tailwind helpers somewhere so that all of the necessary styles can be pulled in. Open up the `App.svelte` file in the `src/` folder, and add the following code to the bottom (replacing any styles that are already there).

```html
<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
```

Then we'll need to ensure Svelte runs the preprocessors on any code in our `<style>` tags. To do this, we'll need to open the `rollup.config.js` file in your editor and add the following at the top of the file.

```js
import sveltePreprocess from 'svelte-preprocess';
```

Then modify the section which looks similar to the following

```js
...
svelte({
  ...
  preprocess: sveltePreprocess({ postcss: true }),
  ...
})
...
```

We should now have Tailwind fully integrated into Svelte. If you rerun `yarn dev` in your terminal you should see it compile the styles before page load and you'll have a stripped back page to jump into.

### Usage

You can now include any of the styles as class attributes for values that already exist as seen below, or you can integrate by using the `@apply` method throughout your Svelte components.

```html
<h1 class="font-bold">Title</h1>
```

```html
<style>
  h1 {
    @apply font-bold text-2xl;
  }
</style>
```
