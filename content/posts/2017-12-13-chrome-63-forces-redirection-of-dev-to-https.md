---
title: Chrome 63 Forces Redirection of .dev Domains to HTTPS
slug: chrome-63-forces-dev-domains-to-https
date: 2017-12-13 00:00:00
description: 'Chrome 63 now forces all domains ending in .dev to be redirected to HTTPS and directly killed my local stack overnight.'
tags:
  - tools
---

> Chrome 63 (out since December 2017), will force all domains ending on .dev (and .foo) to be redirected to HTTPS via a preloaded HTTP Strict Transport Security (HSTS) header.

You can find out more about this change at [https://ma.ttias.be/chrome-force-dev-domains-https-via-preloaded-hsts/](https://ma.ttias.be/chrome-force-dev-domains-https-via-preloaded-hsts/)

As long as I can remember, I've used .dev as a preference for local domains. It seemed like the industry standard and was recommend by a lot of developers. When I woke up to find all my .dev sites were being redirected to https://, I was disgruntled.

I painstakingly had to go and edit a vast amount of databases & files to update the domains that WordPress/Laravel used. Thankfully remapping my hosts took a fragment of the time as I'm using [Laravel Valet](https://laravel.com/docs/5.5/valet). After entering the following in terminal dnsmasq was configured to use an alternative domain (.test) and my sites were back up and running.

```bash
valet domain test
```

Now if only my brain can remember to type .test instead of .dev.
