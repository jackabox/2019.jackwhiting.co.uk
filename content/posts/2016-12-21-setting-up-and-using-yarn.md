---
title: Setting Up and Using Yarn
slug: setting-up-and-using-yarn
date: 2016-12-21 00:00:00
description: 'How to set up and use Yarn (a JavaScript package manager) in replace of NPM whilst keeping your usual workflow.'
tags:
  - tools
---

If you haven't heard of [Yarn](https://yarnpkg.com/) before, it is a Package Manager for JavaScript (which replaces the existing workflow used with the NPM client). Yarn shares a similar workflow, but puts security, speed and reliability at the forefront.

## Why Yarn Over NPM?

So, what makes Yarn better than just carrying on using NPM?

Speed, [Yarn](https://yarnpkg.com/) caches packages so it doesn't need to downloaded it again and again. It also runs the process parallel so the runtime is a lot shorter. Bonus, you can install packages once they've been cached without an internet connection.

Security is key, [Yarn](https://yarnpkg.com/) uses checksums to ensure the integrity of all packages.

Reliability, [Yarn](https://yarnpkg.com/) uses a detailed lock file format, this ensures that if your install works on one system it will perform exactly the same on any other system that utilises Yarn.

## Installing Yarn Globally

We will need to use `npm` for this one, to install Yarn globally, run the following command in terminal..

```bash
npm install -g yarn
```

## Installing Packages

When you want to install a package, you can use a variation of the following command..

```bash
yarn add gulp --dev
```

This would be equal to running..

```bash
npm install gulp --save-dev
```

For a full list of commands take a look at the [CLI docs](https://yarnpkg.com/en/docs/cli/) on Yarn's official website.
