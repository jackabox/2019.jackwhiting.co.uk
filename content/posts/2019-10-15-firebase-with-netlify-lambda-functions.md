---
title: Using Firebase Admin SDK with Netlify Lambda Functions
slug: using-firebase-admin-sdk-with-netlify-lambda-functions
date: 2019-10-15T14:00:00.000+00:00
description: 'Setting up Netlify Lambda Functions for serverless websites and integrating with Firebase Admin SDK to update the database on request.'
tags:
  - firebase
  - lambda
---

I've been recently leaning into spinning up applications with Nuxt and Firebase. These are pretty straight forward applications that handle user authentication and creating/reading of data. However, I've recently come into a case where I needed to send out a request to a third party service and write that back to the database. You could do this within Firebase Functions, but it would require you to be signed up onto one of the paid plans - which I'm not quite ready for yet.

Enter Netlify Lambda Functions, on the free plan you're given a generous amount of resources and it allows you to send requests to third parties. This article is designed to run through a very basic setup of a Netlify Function and how to communicate with Firebase.

The following article covers the following:

1. [Setting up the Structure](#structure)
2. [Integrating Firebase Admin SDK](#firebase)
3. [Configuring your Netlify Deployment](#netlify)
4. [Deploying to Netlify](#deploy)

<h2 id="structure">Project Structure</h2>

We're going to use a very barebones project structure for this demo that has no frontend and only really is used to deploy the functions. These files can easily be transferred into your working directory and the setup would remain the same.

The structure will look a little something like the following:

```bash
.config
.gitignore
functions
  test
    test.js
    package.json
netlify.toml
package.json
```

To get started, create a new directory somewhere on your local machine. Inside of the directory we'll need to create a couple of folders.

First, the functions folder which is where any function you wish to run on Netlify will be housed.

```bash
mkdir functions
```

Next, let us make a directory for the function, the directory should be named whatever you want the endpoint URL to be accessed from. For this demo, we'll name this **test**. We'll also require two files, a JavaScript file named the same as the folder (which will be what Netlify tries to access) and a package.json to keep all of our requirements contained.

Create the folder and files like so:

```bash
mkdir functions/test
cd functions/test
touch package.json
touch test.js
```

Update your package.json with the following:

```json
{
  "name": "functions",
  "version": "1.0.0",
  "description": "",
  "main": "test.js",
  "scripts": {},
  "author": ""
}
```

This is the basic scaffolding you'll need for any function your try and spin up (where you will use npm packages). If you don't plan to use any npm packages, you can not add a package.json.

<h2 id="firebase">Working with Firebase Admin</h2>

Now for the fun part, getting out function to communicate with the Firebase Admin SDK. The following example will feature a very basic creation of a document to show how everything would work, in your actual function you'll probably take this further.

In our `functions/test` add in the Firebase Admin SDK, like so:

```bash
yarn add firebase-admin
```

Which should add the following to your `package.json`

```json
"dependencies": {
  "firebase-admin": "^8.6.0"
}
```

We can then call this in our `test.js` file by declaring it at the top of the document

```js
const admin = require('firebase-admin')
```

#### Firebase Admin Authentication

To actually connect to Firebase we'll need to authenticate the account, this will require the generation of an authentication file from Firebase. This file should be kept **private** and never uploaded to a public Git repository.

To generate the authentication file, follow these steps:

1. Log in to the Google Console at [https://console.firebase.google.com](https://console.firebase.google.com 'https://console.firebase.google.com')
2. Click into the project you want to use the Admin SDK with, or create a new project.
3. Head to the project settings.
4. Click the "**Service Accounts**" tab.
5. Click **Firebase Admin SDK**.
6. On this tab, you'll see "Admin SDK Configuration snippet". Check the **node.js** option and click "**Generate new private key**"
7. A modal should pop up, click **"generate key"** again and this will download a JSON file.
8. Move the JSON file into your project structure in the `functions/test` folder and rename it to `serviceAccountKey.json`.
9. Update your `.gitignore` if you have one to ensure that this file does not get tracked.

#### Writing our Script

To bring everything together and integrate the Firebase Admin SDK with our script we'll need to set up a few more things.

Firstly, we need to configure the script to authenticate the Admin SDK with our firebase credentials. To do this update our `test.js` file with the following:

```js
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json') // Update this to your file

// Initialise the admin with the credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<YOUR-APP-URL>.firebaseio.com'
})
```

Update `<YOUR-APP-URL>` with the actual URL of your app. If you don't know this it can be seen in the Firebase Console.

Next, we'll write a small script that adds a new record to the Firestore database and returns a message once complete. To ensure that data is processed before the response is returned we'll take advantage of `async/await`. See the example below:

```js
// Set up an instance of the DB
const db = admin.firestore()

// exports.handler is required by netlify to process.
exports.handler = async (event, context, callback) => {
  // wait for the record to be added
  await db.collection('COLLECTION').add({
    name: 'Test'
  })

  // Return a callback witha 200 response and a message.
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: `Test data added successfully`
    })
  })
}
```

Don't forget to update the `COLLECTION` placeholder with the name of the collection you want to add a record to, if you are purely testing you can just use `test` here. The full code will look a little like this:

```js
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<YOUR-APP-URL>.firebaseio.com'
})

const db = admin.firestore()

exports.handler = async (event, context, callback) => {
  await db.collection('COLLECTION').add({
    name: 'Test'
  })

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: `Test data added successfully`
    })
  })
}
```

<h2 id="netlify">Netlify Configuration</h2>

To make sure everything works when we deploy it to Netlify, we'll need to configure a few things and install a dependency in our main site directory. In the root folder, if you do not have a `package.json` create one with the following command. If you already have a `package.json` you can ignore this step

```bash
touch package.json
```

Netlify requires that your run `npm install` or `yarn install` for each function we create, this is due to the way we've set up the files to keep things contained within each folder. To do this we can create a simple script in our `package.json` and tell Netlify to use it when we deploy. Update your package.json with the following:

```json
"scripts": {
  "functions": "cd functions/test && yarn install"
}
```

Note, this will `cd` into the `functions/test` folder, we created and then run `yarn install` to download all our dependencies (in this case just Firebase Admin SDK).

#### Netlify Configuration

To tell Netlify to run the command, we'll need to create or update a `netlify.toml` file. Create a new file in the root directory with the following:

```bash
touch netlify.toml
```

Inside the file add the following.

```toml
[build]
command = "yarn functions"
functions = "functions"
```

This will tell Netlify that the `functions` folder contains all of our functions we have set up (in this case just the **test**) and that we want to run the `yarn functions` command on initial deploy which will download all the assets.

If you have existing code in your repository, such as a react app, you may need to take a look at [Concurrently](https://www.npmjs.com/package/concurrently 'Concurrently NPM') which will allow you to run multiple commands.

#### Node Environment

Firebase Admin SDK requires Node v10 for it to work. By default, Netlify Lambda runs in Node v8 so we'll need to add an environment file that tells Netlify to use v10 on the Lambda instance instead. To set the variable, you'll need to do the following:

1. Log in to the [Netlify Console](https://app.netlify.com/ 'netlify'). Click into (or create) the site you want.
2. Click into the **Settings** tab.
3. Click **Build & Deploy** in the sidebar.
4. Click **Environment** under the **Build & Deploy** tab.
5. Click **Edit Variables.**
6. Add the following key `AWS_LAMBDA_JS_RUNTIME` with the value `nodejs10.x`
7. Save

<h2 id="deploy">Deploy Your Code</h2>

Commit everything and push the code up to your preferred provider. If you have Netlify set to auto-deploy then everything will be processed and your functions will be created after deployment. You'll be able to see these by going to the **Functions** tab in the **Netlify Console**.

If you click the `test.js` function in the Netlify Console, it will provide you with an endpoint URL which you can visit in your browser to test that everything works and your Firebase DB gets updated.
