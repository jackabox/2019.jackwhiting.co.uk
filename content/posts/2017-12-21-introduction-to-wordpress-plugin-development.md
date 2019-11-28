---
title: An Introduction to WordPress Plugin Development
slug: introduction-to-wordpress-plugin-development
date: 2017-12-21 00:00:00
description: 'Plugins play a key part in how we handle WordPress builds and offer services to clients. This article involves a brief write up of how to get started building your own WordPress plugins.'
tags:
  - php
  - wordpress
  - plugins
---

_This post was written for internal development at Adtrak to help with stepping into WordPress Plugin development. Below is a copy of the article._

Plugins play a key part in how we handle WordPress builds and offer services to clients. Whether it is a plugin such as our “Core” which adds repeatedly used code to WordPress and cleans up the outputs of themes, or something a little more complex such as the “Skip Hire Plugin” which provides a full e-commerce solution for booking skips online. Using plugins allows us to be more efficient in the development of websites.

## What is a WordPress Plugin?

A plugin is a PHP script (or group of) which modifies and extends the native functionality. WordPress is built with a [Plugin API](https://codex.wordpress.org/Plugin_API) that gives us some distinct benefits such as:

- Removing the need to modify any core files, providing a much easier update and maintenance process.
- Allows the update of plugins separately from any other code, providing critical fixes where needed across multiple sites.
- Abstracts the functionality from Themes, making our files both cleaner and more maintainable.
- Allows for the use of Object Orientated Programming with the ability to still hook into WordPress functions, classes and APIs.

## Plugin Names & Structure

Plugins should always have a unique name, this is to ensure we do not get conflicts with other plugins (both installed and on the public plugin repository) or have problems with updates.

At Adtrak, we tend to prefix everything with `adtrak` which removes any problems with conflicts, as well as providing a clear view of what plugins are ours in the WordPress admin.

### Structure

It is crucial you keep everything organised when building a plugin, as this makes maintenance easier. Typically, a good starting point for a WordPress plugin is with the following file structure.

<p style="text-align:center">
    <img src="/img/wp-plugin-folder-structure.png" alt="WP Plugin Examlple Structure">
</p>

_Note: When you start to write plugins more often, you may use a framework which tend to follow a different structure._

### Plugin Header

Every plugin requires a header. This allows WordPress to read the files and tells it how to interpret the code. The header of a plugin, similar to that of a theme, is a comment block at the top of our main plugin file.

```scss
/*
Plugin Name: Adtrak Plugin
Description: A quick excerpt about our plugin.
Version: 1.0
Author: Adtrak
Author URI: http://plugins.adtrakdev.com/
Plugin URI: http://plugins.adtrakdev.com/adtrak-plugin
*/
```

### Plugin Conflicts

Typically, within a plugin you’ll create functions which handle specific tasks. If you have a multitude of plugins installed, or you use very generic naming of functions, you’re going to encounter some conflicts. There are two main ways to resolve this, these are:

- Always prefix your functions with the name of your plugin.
- Always wrap any declarations of functions in an if statement to check if a function with the same name already exists.

```php
function create_post_type() {
   // create page
}

create_post_type();
```

Would become

```php
if (! function_exists('adtrak_plugin_create_post_type') {
  function adtrak_plugin_create_post_type() {
     // create page
  }
}

adtrak_plugin_create_post_type();
```

## Actions & Filters

The WordPress Plugin API provides a quick way to access the core of WordPress through the use of **actions** and **filters**. Let’s breakdown what these do and how they can be used within Plugin Development.

### Actions

Actions are called at specific times. When they are triggered WordPress will find any functions which have been declared to an action and execute them in the order of priority. Whenever you are going to interact with the WordPress core this will usually be done via an action.

For example, you might want to create a custom post type and register it when the site is initialised, to do this you might call the action of `init` which will ensure the custom post type is registered whenever WordPress is initialised.

#### Executing Your Functions

To execute any functions you write, and get WordPress to understand what’s going on, you’ll need to use the [`add_action()`](https://developer.wordpress.org/reference/functions/add_action/) function, this takes the following parameters.

- `$hook` (required, the hook in WordPress we wish to call upon).
- `$function_to_add` (required, your defined function that we wish to call).
- `$priority` (optional, the order to load the action in, the smaller number the sooner it will execute).
- `$accepted_args` (optional, required when the action has one or more variables passed).

```php
if (! function_exists('adtrak_plugin_create_post_type') {
  function adtrak_plugin_create_post_type() {
     // create page
  }
}

// when init is triggered, register our custom post type
add_action('init', 'adtrak_plugin_create_post_type');
```

When using WordPress actions you need to keep in mind that an action may have required/defined variables that you need to pass through. If we look at the `save_post` hook, we have something along the following:

```php
// the save post action, defined in WordPress
do_action('save_post', $post_ID, $post, $update);

// add our function onto the 'save_post' hook, supplying priority and args
add_action('save_post', 'save_my_page_extended', 10, 3);

// function executed on save (we want all three variables)
function save_my_page_extended($post_ID, $post, $update) {
    // access all of our variables to do some work
}
```

The `do_action()` defines the hook and has three additional args passed through, therefore when we call our action we have to specify “3” as the last `$args` parameter. Any of the actions can be found on the [WordPress developer site](https://developer.wordpress.org/) or you can search your local WordPress files.

## Filters

Filters are a way to accept variables and return them back after being modified. Filters are often used when you want to manipulate the way default information is displayed.

WordPress comes with a lot of filters in by default and can be utilised by using the `apply_filters()` function. `apply_filters` takes the following arguments:

- `$tag` (required, name of filter)
- `$value` (required, the variable we wish to filter)
- `$var` (optional, any extra values you wish to pass to your function)

When writing plugins, you’ll often create filters so that users can modify elements without having to alter the source code.

You would call the `apply_filters` function by doing something similar to the following:

```php
echo apply_filters('the_excerpt', get_the_excerpt());
```

### Creating Filters

Let’s look at an example. If we are displaying currency on a page, we may want to create a filter that configures the output of the data. We’d use the `apply_filters` function to tell WordPress that these can be changed by any function that hooks into it.

```php
$price = apply_filters('adtrak_filter_display_price', '20.00');
```

### Utilising Filters

When you want to utilise a filter, you need to use the `add_filter()` function. This takes the following arguments:

- `$tag` (required, name of the filter).
- `$function_to_add` (required, the function you wish to call).
- `$priority` (optional, priority of the call)
- `$accepted_args` (optional, required if we pass multiple arguments through).

The `add_filter` function works similar to that of `add_action`. The minimum that you need to define is the name of the filter and the function you want to call. Below is an example of how you may do this with the above `apply_filters` example.

```php
function adtrak_change_price_output($price)
{
	$price = '&pound' . $price;
	return $price;
}

add_filter('adtrak_filter_display_price', 'adtrak_change_price_output');
```

This will attach the `adtrak_change_price_output` function to the `adtrak_filter_display_price` filter and takes a single variable of `$price`.

All filters **must return a value**, this is extremely important. If you do not return a value then things will break. The way WordPress chains multiple functions on a filter is by utilising the return value and passing it to the next function until all functions have been called.

## Building a Plugin

The way you build a plugin will completely depend on the circumstances and what you are trying to achieve with it. For reference there are various APIs/methods you can access, these can be found on the developer documentation. Some examples include:

- [Shortcode API « WordPress Codex](https://codex.wordpress.org/Shortcode_API) - Shortcodes allow you to define a function, with parameters, that can be executed from inside of the content editor. Typical reasons for these are contact forms, galleries or sliders.
- [Widgets API « WordPress Codex](https://codex.wordpress.org/Widgets_API) - Widgets allow you to define blocks of executable code, with optional fields, which can be placed within the WordPress sidebar feature.

## Continued Learning

This post is a brief summary to the basic features you’ll access and use when writing WordPress plugins as well as an introductory outline of structure. This should be enough for you to create a basic plugin. Why not try creating one? Some example projects include:

- Creation of a custom post type and adding meta fields.
- Adding a custom options page to the admin that you can utilise in a theme.
- Providing common functionality in a helper plugin.

In a future post we’ll cover the ways in which we can expand on this with our internal framework and go over the building of a plugin.

_References: WordPress Developer Docs, Sitepoint, Smashing Magazine_
