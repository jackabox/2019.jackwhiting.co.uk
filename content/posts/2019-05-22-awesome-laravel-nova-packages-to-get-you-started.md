---
title: Awesome Laravel Nova Packages to Get You Started
slug: awesome-laravel-nova-packages
date: 2019-05-22 23:00:00
description:
  A collection of five packages to kickstart your next project with Laravel
  Nova. These are some of my personal favourites that I use on every project.
tags:
  - laravel
  - nova
---

I've been using Laravel Nova a lot since it's release and find myself using the same packages across projects just because they're awesome and work well. In this post I've compiled a list of my five favourite packages to include in your Laravel Nova install.

If you haven't used Nova before, it's an admin package written for Laravel and allows for rapid prototyping of a CRUD admin system quickly. It's also extensible and all written within Vue/Tailwind. I'd suggest checking it out for your projects at [https://nova.laravel.com/](https://nova.laravel.com/).

## Nova Flexible Content

Nova Flexible Content is a package written by [Whitecube](https://github.com/whitecube) and allows for a way to build repeatable fields on your models. It generally allows for any subfield or other package to be passed through and will collate the data into JSON to be saved in your table.

The team have been awesome at fixing out a few bugs and providing updates. They've recently included the ability to have nested flexible content which takes this package to the next level.

GitHub Link: [https://github.com/whitecube/nova-flexible-content](https://github.com/whitecube/nova-flexible-content)

## Advanced Nova Media Library

Advanced Nova Media Library takes the [Spatie's Media Library](https://github.com/spatie/laravel-medialibrary) and extends it to be integrated into Nova. I've been using Spatie's Media Library for several years and have found it to be an invaluable resource - especially with the generation of responsive images.

This package by [Eduard Bess](https://github.com/ebess) integrates all the Spatie goodies into Nova and allows for the defining of gallery, files or single images. It also allows for the clipping of images upon upload which makes package even nicer.

GitHub Link: [https://github.com/ebess/advanced-nova-media-library](https://github.com/ebess/advanced-nova-media-library)

## Nova Duplicate Field

Nova Duplicate Field is the first package I wrote for Nova and allows for the quick duplication of models and their relations. This package takes a few parameters and utilises them at the click of the button. It will then redirect you to the edit view so that you can make any necessary changes that you need.

It's currently at around ~2000 installs.

GitHub Link: [https://github.com/jackabox/nova-duplicate-field](https://github.com/jackabox/nova-duplicate-field)

## Nova Snowball

This one is a theme but [Stephen Lake](https://github.com/stephenlake) has generated a really clean interface on top of Nova which cleans up a few things to my personal preference such as collapsable field groups and reducing the white space around elements. It also provides some responsive elements which Nova does not do by default.

GitHub Link: [https://github.com/stephenlake/nova-snowball](https://github.com/stephenlake/nova-snowball)

## Nova Backup Tool

This one is direct from [Spatie](https://github.com/spatie) and provides a slick interface for monitoring the back ups of your site. It's crucially important to keep a solid backup and this package will allow you to trigger a manual backup or see the status of your scheduled backups.

GitHub Link: [https://github.com/spatie/nova-backup-tool](https://github.com/spatie/nova-backup-tool)

That's all for this list, but if you have any packages your particularly fond of? Drop me a tweet [@jackabox](https://twitter.com/jackabox) and let me know!
