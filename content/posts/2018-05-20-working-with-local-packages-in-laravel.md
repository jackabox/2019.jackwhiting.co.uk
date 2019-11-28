---
title: 'Working on Local Packages in Laravel with Composer'
date: 2018-05-20 00:00:00
slug: working-with-local-packages-in-laravel
description: 'Working on Packages for Laravel in a local environment can be a little annoying to start. Utilising Composer we can make this process as simple as cloning a repository.'
tags:
  - laravel
  - php
  - composer
  - packages
---

Recently, I've been working on developing a set of packages for Laravel to wrap up some of the code we write on a daily basis. Whilst developing I needed a way to reference a local package to my Laravel install and wanted to use `composer.json` to include, and update it's dependancies.

To do this, I found it often easier to symbolic link my package into a directory within my Laravel project called `packages/namespace/package-name` and then set up Composer to read it automatically.

- **Packages** is the folder I store all the local packages I'm working on.
- **Package Group** is usually the name (i.e. creator, user account on GitHub/composer)
- **Package Name** is the name of the package I want to install.

An example of this would be

```bash
packages/jackabox/admin
```

## Create the symbolic link

I store all the packages I write in a separate directory on my computer but I also often work with other developers to implement and test their packages. To keep a consistent workflow, I often clone and keep all of the packages into their own directory, away from all the business of the main Laravel package.

To include them in my Laravel project, I'll run a symlink which looks something like the following (changed to your own sources).

```bash
cd project
mkdir packages
mkdir packages/namespace
ln -s ../packages/admin packages/namespace/admin
```

Perfect, now we just need to get composer to read the files.

## Setting Up Composer

To get composer to read a local package, we have to manually add the reference to the repositories section of the JSON. This would look something along the lines of the following:

```json
"repositories": [
    {
        "type": "path",
        "url": "packages/namespace/admin",
        "options": {
            "symlink": true
        }
    }
],
```

After that we need to require the file by adding it to our requires object, as so:

```bash
"require": {
    ...
    "namespace/admin": "dev-develop"
},
```

After that, within our Laravel project, we can run `composer update` (or `install`) and Composer will read our local package, create a copy in the vendor folder, download all other required packages and set up the autoload.
