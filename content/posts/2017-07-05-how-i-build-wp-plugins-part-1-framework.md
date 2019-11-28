---
title: 'How I Build WordPress Plugins: Part 1 - Framework'
slug: how-i-build-wordpress-plugins-framework
date: 2017-07-05 00:00:00
description: 'Part 1, Utilising a framework in the development of WordPress Plugins. A brief explanation on how I begin rapid development.'
tags:
  - plugins
  - wordpress
  - php
---

I've been writing custom WordPress plugins for a couple of years now and wanted to share some of the details on how I've been working. There will be a few parts to these articles, and in this one we're starting with the Plugin Framework.

## Intro

Within the last year or so, I stumbled across [Herbet](http://getherbert.com). Herbert is a plugin framework for WordPress that allows for a structured approach, similar to that of Laravel but tailored for a WordPress context. I downloaded it, tested it, and loved how easy I found it to use.

Unfortunately, the last update to Herbert was nearly 2 years ago and I didn't want to start writing commercial plugins on a framework that could break with the next WordPress core update. I looked for other solutions, even just writing Plugins from scratch, but I still had an itch to use a framework. Nothing came close to what I was looking for.

I ended up building a framework for Plugins (nicknamed Billy), close to that of Herbert, but with custom functionality and removing redundant code I didn't need. Within Adtrak, this is what we use to write all of our plugins and there is currently 12 that are released on the framework.

The following section explains a bit of how I'd go about setting up a plugin to utilise the Billy Framework.

## Setting Up Billy

You can find Billy at [https://github.com/getbilly/boilerplate](https://github.com/getbilly/boilerplate).

Download or clone the repo onto your computer in Terminal, like so:

```bash
git clone https://github.com/getbilly/boilerplate.git my-plugin
```

Once you've cloned the repo, you'll want to move open the folder in your text editor. In the `app` folder go through each of the files and replace the namespace with your own, for example:

```php
namespace MyPlugin
```

becomes..

```php
namespace Jackabox\PluginName
```

Update the composer file's autoload so that it matches the namespace you just defined.

```json
"autoload": {
  "psr-4": {
    "Jackabox\\PluginName\\": "app/"
  }
}
```

Once all that's done, open up the folder you cloned the repo to in Terminal and run composer install. This will download all of the needed dependencies.

```bash
cd my-plugin
composer install
```

The plugin files are now setup and ready to work with, from here we can build anything that our heart desires.

For more information about Billy and how to work with it, you can view the initial docs on the [website](https://getbilly.github.io/website/) or have a look at an [example plugin](https://github.com/getbilly/plugin-examples).
