---
title: Handling Redirects in a Laravel Application
slug: handling-seo-redirects-in-a-laravel-application
date: 2019-08-14 11:00:00
description: "Most websites will need to manage their redirects at some point. For this, we're going to utilise a Spatie package to read redirects from a configuration file and/or a database table."
tags:
  - laravel
  - seo
---

In this article, we're going to talk about an easy way to manage our redirects within a Laravel application. The following will allow for the storing of redirects in a database (to hook into Nova, or another CRUD system) and also the reading of redirects from a config file.

A lot of the hard work has been done for us by the wonderful team at Spatie whom have produced a redirector package which allows for route params to be read and parsed. You can find this package at [https://github.com/spatie/laravel-missing-page-redirector]().

Let’s get started on setting up our application.

## Setting up the Redirector Package

Install the required package via Composer.

    composer require spatie/laravel-missing-page-redirector

Next, we’ll need to publish the package config, we can do this by running the following in our terminal.

    php artisan vendor:publish --provider="Spatie\MissingPageRedirector\MissingPageRedirectorServiceProvider"

In this file you will find an empty array of redirects, this is what we can edit with any redirects you wish to add, specifying the **from** and **to** destination as a `key => value` pairing, for example:

    redirects = [
    	'/home' => '/',
        '/blog/*' => '/news/*'
    ],

For the redirector to work, we need to add the middleware to `app/Http/Kernel.php`, open it up and add modify the `$middleware` with the following:

    protected $middleware = [
      ...
      \Spatie\MissingPageRedirector\RedirectsMissingPages::class,
    ],

## Connecting with our Database

Sometimes, we will want to have access to all of our redirects in the database - for example if you are passing the site off to a client and want to give them control. To do this we will need to create the database structure for the redirects and then modify the config we published earlier to read them.

Let's get started by making the migration to create our database.

    php artisan make:migration create_redirects_table

Update the generated migration as below:

```php
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRedirectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('redirects', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('old_url');
            $table->string('new_url');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('redirects');
    }
}
```

Run the migration so that the database is created.

    php artisan migrate

Next, let's make the model to handle the retrieving/storing of our database entries.

```bash
php artisan make:model Models/Redirect
```

Again, replace all of the code in the newly created file with the following:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Redirect extends Model
{
    protected $guarded = ['id'];

    public static function boot()
    {
        parent::boot();

        static::saved(function () {
            Cache::forget('redirect_cache_routes');
        });
    }
}
```

To explain the code above a little, we only have the ID as guarded and allow everything else to be mass assignable, you can update this to your preferences. You will also notice I am using the `boot()` function here to clear a cached value, this will come into play a little later when we handle the redirects. I would usually achieve this through a [model observer](https://laravel.com/docs/5.8/eloquent#observers), but for the purpose of this tutorial, I've left it on the model.

Next, let’s create a redirector class that inherits the Redirector interface defined by the Spatie package and update it to allow for population from the database also. Create a new file in `App\Services` (or wherever you wish to store this) called **DatabaseRedirector**

```php
<?php

namespace App\Services;

use App\Models\Redirect;
use Spatie\MissingPageRedirector\Redirector\Redirector;
use Symfony\Component\HttpFoundation\Request;
use Illuminate\Support\Facades\Cache;

class DatabaseRedirector implements Redirector
{
    public function getRedirectsFor(Request $request): array
    {
    	// Get from the database and remember forever
		// we clear this on new model or updated model
        $dbRedirects = Cache::rememberForever('redirect_cache_routes', function () {
            return Redirect::all()->flatMap(function ($redirect) {
                return [$redirect->old_url => $redirect->new_url];
            })->toArray();
        });

		// Get the redirects from the config
        $configRedirects = config('missing-page-redirector.redirects');

		// Merge both values
        return array_merge($dbRedirects, $configRedirects);
    }
}
```

Finally, let's update the `config/missing-page-redirector.php` to the below. This will overwrite the default handler to the one we just created and load all our redirections from the database alongside those manually defined in the `redirects` array.

```php
<?php

return [
    /*
     * This is the class responsible for providing the URLs which must be redirected.
     */
    'redirector' => \App\Services\DatabaseRedirector::class,

    /*
     * By default the package will only redirect 404s. If you want to redirect on other
     * response codes, just add them to the array. Leave the array empty to redirect
     * always no matter what the response code.
     */
    'redirect_status_codes' => [
        \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND,
    ],

    /*
     * When using the `ConfigurationRedirector` you can specify the redirects in this array.
     * You can use Laravel's route parameters here.
     */
    'redirects' => [],
];
```

Populate the database where needed, and enjoy!
