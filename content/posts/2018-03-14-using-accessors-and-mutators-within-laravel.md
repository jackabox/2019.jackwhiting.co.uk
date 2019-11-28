---
title: 'Using Accessors and Mutators to Abstract Common Functionality within Laravel'
date: 2018-03-14 00:00:00
slug: using-accessors-and-mutators-within-laravel
description: 'Accessors and Mutators can help with abstracting common functionality in our application into one consistent location. By utilising them we can provide a more consistent codebase and improve the workflow between developers.'
tags:
  - laravel
  - php
---

A common thing I've found when analysing or revisiting code, is that logic will be repeatedly written throughout different parts of an application, be it in different controllers or views, or even extra database tables are created to store logic that is calculated, potentially increasing query counts.

Laravel has a pretty awesome way of allowing us to utilise the model to contain this logic and reduce repetition.

This is done via the use of Accessors and Mutators. Used right they can be really beneficial and make an application simpler, cleaner and much more accessible - which is great for everyone involved.

## Accessors

Accessors are a way of telling a model how to get some form of information and the way it should be presented.

This can be the manipulation of data that already exists in a models properties, for example to capitalize a name, or to create some new logic which we may want to use in several places.

If we take the example of a product. Products usually have prices, you'll probably store this in the database which is fine but what if you also want to get the price with or without VAT (or other taxes) on top.

We can handle this as an accessor in our model. To do this, we'd create a function starting with `get` and ending in `Attribute`, creating something along the lines of the following.

```php
<?php
namespace App\Models;

class Product {

    /**
     * Get the price including vat attribute
     *
     * @return string
     */
    public function getPriceIncVatAttribute()
    {
        return $this->price * 1.2;
    }
}
```

We can then utilize this code the same way you would any other property of a model and call it by doing the following

```php
$product = Product::find(1);
echo $product->price_inc_vat;
```

To take this a step further, you may want to make the new attribute available within the the model properties by default, rather than just when we call it. This is really useful if we are creating an API or passing a lot of logic to a front end component (such as Vue.js).

To do this we'd need to add it to the `appends` variable in the model.

```php
<?php
namespace App;

class Product {

    protected $appends = ['price_inc_vat'];

    /**
     * Get the price including vat attribute
     *
     * @return string
     */
    public function getPriceIncVatAttribute()
    {
        return $this->price * 1.2;
    }
}
```

This will now automatically call the `getPriceIncVatAttribute` whenever we request the model. Incredibly useful.

### Accessors With Queries

You can also use accessors to handle the logic of relations or queries. This can be useful if you find yourself repeating a section of code a lot.

If we carry on with the products example. Somewhere on your site you might want to count the items a user has added to their basket.

We could define an accessor to reference the items and count them.

```php
public function getItemCountAttribute() {
    return $this->items()->count();
}
```

Then in our view we can just call the attribute, as such

```php
echo $basket->item_count;
```

**Note:** It is always good to think about whether you need to add an accessor with a database query to the `$appends`. Doing so will make an extra query every time a model is loaded, rather then as and when it is needed. There is a use-case for both.

## Mutators

Mutators work with the way that we **set** data in our model. They become really useful for when you want to always perform logic on data before it is stored.

If we take a simple example of storing specifications for a product, we might want to store them as a json object. In our database we may have a column called `specifications` with the type of `json` and to store the data here we'd need to make sure it was formatted correctly.

We would then want to define a mutator on the model which will run `json_encode()` on the data.

To do this, we'd need to create a new function follows a structure of `setTableColumnAttribute`. Something along the lines of the following

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Product extends Model
{
    /**
     * Set the user's first name.
     *
     * @param  string  $value
     * @return void
     */
    public function setSpecificationsAttribute($value)
    {
        $this->attributes['specifications'] = json_encode($value);
    }
}
```

Then when we are updating or saving a new record, we could just pass our array, and the mutator would handle the encoding of the data.

```php
public function update(Request $request)
{
    $product = Product::find(1);
    $product->specifications = $request->specifications; // passes an array
    $product->save();
}
```

This is a relatively simple use case for a mutator, but here we're abstracting the code that may be used in several places and ensuring it is constantly handled with the same logic, providing a nicer experience for developers to work with and a cleaner code base.
