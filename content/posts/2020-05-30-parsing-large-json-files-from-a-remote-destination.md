---
title: 'Parsing JSON Files from a Remote URL with Node, JSONStream and Hyperquest'
slug: 'parsing-json-files-in-node-with-hyperquest-jsonstream'
description: 'Today we will learn how to utilise JSONStream and Hyperquest to parse and stream (large) JSON files from remote URLs within Node.'
summary: ''
date: 2020-05-30T00:00:00
categories:
  - Node
ogImage: '/img/posts/og-parsing-json-with-node-stream-hyperquest.jpg'
---

Working with large data files can be tough and cause a bottleneck within your application. We can't just simply load the file all at once and expect everything to work. We need to iterate over the data and parse it in chunks.

# Pre-requisites

For this project, we will look to use [Node](https://nodejs.org/en/), [Hyperquest](https://www.npmjs.com/package/hyperquest), and [JSON Stream](https://www.npmjs.com/package/JSONStream) to fetch the file from a remote URL, parse it and then handle the data retrieved.

This article assumes you know how to use the basics of node.

To get started, open up your working directory in your code editor and create a new file named `parser.js` in the root.

# Fetching the JSON

To be able to have something to work with, we will need to fetch the data we want from a remote server. If you want to test this out with a JSON file I recommend using the Scyfall JSON Endpoint for all of the Magic! The Gathering cards which you can find at [https://archive.scryfall.com/json/scryfall-default-cards.json](https://archive.scryfall.com/json/scryfall-default-cards.json).

Before we can start installing things you will need to set up a `package.json` to install our NPM packages. You can do this with Yarn or NPM.

```bash
yarn # or npm install
```

Next we will need to install hyperquest.

```bash
yarn add hyperquest
```

Hyperquest is a subset of `request` written to handle large payloads of data without breaking our server. It works by fixing a lot of issues with HTTP so that any pesky bugs don't get in the way.

Let's set things up, at the top of the `parser.js` file import hyperquest.

```js
const hyperquest = require('hyperquest');
```

Next, create a new function which will house our logic. While we are here, set a variable for the URL to the location fo the JSON file.

```js
const parser = async () => {
  const url = 'https://site.com/linktoyour.json';
};
```

Next, let us initialise `hyperquest` to fetch the data so that we can pass it through to our follow up functions. We are using `await` here to ensure that everything gets processed before moving on.

```js
const parser = async () => {
  const url = 'https://site.com/linktoyour.json';

  await hyperquest(url);
};
```

Hyperquest allows you to create a pipeline so you can pass the data received to other functions by appending `.pipe(func)`, we are going to utilise this in the next step.

## Handling the Returned Data

We are going to lean on a few more packages here to handle the data returned and make sure it is processed correctly. These are:

1. [JSONStream](https://www.npmjs.com/package/JSONStream) - Which allows us to stream the parsing of the results returned.
2. [event-stream](https://www.npmjs.com/package/event-stream) - Which allows us to process the parsed data

Install them into the project.

```
yarn add JSONStream event-stream
```

Import them at the top of the `parser.js` file.

```js
const JSONStream = require('JSONStream');
const es = require('event-stream');
```

The first pipeline function we will add is for JSONStream. This will ensure everything is returned properly in a readable format. Update our code to the following.

```js
await hyperquest(url).pipe(JSONStream.parse('*'));
```

The `*` passed through to the `parse` function is telling the JSONStream package that I wish to return every row in my JSON file. If all of your records were contained inside of a `data` object. You may adjust the code to something closer to `JSONStream.parse('data.*')`.

Next, add a pipeline for processing the data with `event-stream`, update the code to add the following `.pipe()`.

```js
await hyperquest(url)
	.pipe(JSONStream.parse('*'))
	.pipe(es.map(async (data, callback) => {
		console.log(data);
		callback(null, data);
  })
```

To explain what we have so far, for every row we return with JSONStream it will be passed to the event-stream function and `console.log` the data (purely for testing this works). Finally we we call the `callback()` function which will drop current data and returns a data entry without the current record so we can loop back around.

Our full code should look like the following:

```js
const hyperquest = require('hyperquest')
const JSONStream = require('JSONStream');
const es = require('event-stream');

const parser = async () => {
	await hyperquest(url)
		.pipe(JSONStream.parse('*'))
		.pipe(es.map(async (data, callback) => {
			console.log(data);
			callback(null, data);
	  })
}

parser()
```

We won't go into the processing of the data as this can be done in a multitude of ways, but if you run `node parser.js` you should start to see the rows being logged in the console.

I've added a stripped down example of a project on [GitHub](https://gist.github.com/jackabox/60a5343eba05f3cfcc3d3886e6c85acf).

I hope this helps you out in the future.
