---
title: 'Using Visual Studio Code (with 5  Recommended Extensions)'
slug: using-vs-code-and-recommended-extensions
date: 2016-08-22 00:00:00
description: 'A break down of Visual Studio Code with five recommended extensions to get you up and running when moving from Sublime or Atom.'
tags:
  - tools
  - vscode
---

I constantly toy with which IDE/Text Editor I want to use in my workflow. I’ve tried six or seven in the last few months to find something that fits my personal work flow and always ended up reverting to [Sublime Text 3](https://www.sublimetext.com/).

I require my editor to be customisable, is extendable and has support for colour schemes (it’s the little things). When I stumbled on [Visual Studio (VS) Code](https://code.visualstudio.com/) recently and found that it and ticked all of my boxes, I decided to dive in and test it out.

It has a relatively nice interface out of the box, shares similar commands to Sublime Text  (you can also get a complete remap to be identical under the extensions)  making the transition that much smoother, and has a huge library of extensions.

## Features

VS Code comes with Debugging, Git Support, and IntelliSense (a smart engine when writing code) out of the box.

I use Git on a daily basis, for every project I work on, and commit often and a lot. Having a visual indication of modified files and being able to commit straight from the application has decreased the time I spend moving between applications, increasing my productivity.

The IntelliSense is a pretty nifty feature which provides smart completions based on variable types, function definitions, and imported modules. This is probably one of the features that’ll keep me using VS Code, it just works, scanning files and providing notices of any functions or variables, it manages to do this on the fly and helps with keeping focus by not needing to switch between files to remember a class name.

Debugging — well this is just great, always. You can attach any running apps you need to VS Code and start debugging with break points, call stacks, and an interactive console. You can also expand the debugging capabilities with extensions (see below).

## 5 Recommended Extensions

Below are a few of my recommended extensions if you are using VS Code. They help improve little bits of the application and have become a staple in my workflow.

### 1. HTML/CSS Class Completion ([available here](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion))

This extensions provides you with a prompt to any class names when you start typing in your HTML. It’s really handy for building on the IntelliSense and helps keep you focused when you’re writing code. After all, who likes to keeping going back and forth between files?

### 2. JSHint ([available here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.jshint))

Simply put, this extension integrates JSHint into VS Code. It will keep your JavaScript in tip-top shape and help you avoid any pesky errors with formatting.

### 3. Git Project Manager ([available here](https://marketplace.visualstudio.com/items?itemName=felipecaputo.git-project-manager))

Since I use Git on every project I code, I love this extension. You define a location where your projects live and it will scan for any git folders you have and bring them back into the command pallet. No more opening finder, finding the folder, and then dragging it into the VS Code window. CMD + ALT + P and open the right project.

### 4. PHP Debug ([available here](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug))

This extension will allow you to plug XDebug into VS Code. PHP Debug leverages XDebug’s remote debug feature to bring it into VS Code. It has helped me when trying to find any errors in PHP files and make sure I’m not missing something obvious.

### 5. Debugger for Chrome ([available here](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome))

If you needed a way to debug JavaScript in Chrome, without actually leaving VS Code, this would be the extension for you. It’ll allow you to debug any errors which occur on the source files, rather than what your browser sees, helping you remove any root issues.

Give [VS Code](https://code.visualstudio.com/) a try and let me know what you think.
