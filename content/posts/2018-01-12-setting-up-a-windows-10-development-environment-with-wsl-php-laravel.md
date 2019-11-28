---
title: Setting Up A Windows 10 Development Environment with WSL, PHP & Laravel
slug: setting-up-a-windows-10-development-environment-with-wsl-php-laravel
date: 2018-01-12 00:00:00
description: 'Guide & Tutorial on setting up WSL (Windows Subsystem for Linux) with a Laravel/PHP development stack for simplified coding on Windows 10.'
tags:
  - tools
  - windows
---

## Preface

Recently, I've been toying around with the use of WSL (Windows Subsystem for Linux) for development. I've used a Mac for development work over better part of the last decade and required the Windows setup to mimic my workflow.

Typically, I create Laravel applications along with the occasional WordPress site, using the following tools:

- Nginx
- PHP
- MySql
- Dnsmasq
- Valet

After a bit of testing and reconfiguration, I managed to get WSL setup with the above in a few easy steps and I'm relatively happy with the workflow.

The rest of this article will cover the process undertaken.

## Installing WSL & Ubuntu

1. First things first, you're going to need to enable the Windows Subsystem for Linux, to do this use "Turn Windows features on or off" and select "Windows Subsystem for Linux" to enable it, click OK, reboot, and use this app. For more information on this you can view the [Microsoft Documentation](https://docs.microsoft.com/en-us/windows/wsl/install-win10).
2. Once rebooted, you're going to need to install a subsystem, for the purpose of this article I chose Ubuntu. You can find the Linux Subsystem and others in the Windows Store. Go a head and [download Ubuntu](https://www.microsoft.com/en-gb/store/p/ubuntu/9nblggh4msv6).
3. When Ubuntu is installed, you're going to need to configure it a little, open up command prompt (or any other terminal emulator you have - such as Hyper/CMDer) and enter `ubuntu`. This will run the setup process and ask you to set a username and password. Do this.

WSL should now be installed, setup, and ready for us to use.

## Setting Up Our Base Requirements

1. As of writing this, I'll be using PHP 7.1. To access and install PHP, we'll need to add the personal package archive so that Ubuntu can recognise the libraries. To do this run the following command.

   ```bash
   sudo add-apt-repository ppa:ondrej/php
   ```

2. Next, we'll need to update and upgrade Ubuntu to download the latest packages (and our newly added PHP packages).

   ```bash
   sudo apt-get update && sudo apt-get upgrade
   ```

3. Before we can install Valet we are required to install a few packages. I've tried to reduce the list to only the barebones I'd require, so if you find you need anymore feel free to add them here. Run the following command and go grab a drink (this one may take a while).

   ```bash
   sudo apt-get install php-fpm php-mysql php7.1-cli php7.1-curl php7.1-mbstring php7.1-mcrypt php7.1-xml php7.1-zip php7.1-intl curl git unzip php-cli
   ```

4. Download and install Composer.

   ```bash
   cd ~
   curl -sS https://getcomposer.org/installer -o composer-setup.php
   sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
   ```

5. I found that the only way to get Valet working on the current release of WSL was to use a fork of the Linux Valet repository by [valeryan](https://github.com/valeryan/valet-wsl). To install this, we'll need to modify the global composer file located at `~/.composer/composer.json`. Add the following code:

   ```json
   {
     "require": {
       "valeryan/valet-wsl": "dev-master"
     },
     "repositories": [
       {
         "type": "vcs",
         "url": "git@github.com:valeryan/valet-wsl.git"
       }
     ]
   }
   ```

6. To install, run `composer global update`.
   ​
   _You may encounter a permissions error here, if you do, modify the ownership of the `.composer/` directory by running the following`sudo chown -R $USER .composer/`._

7. Next, run the `valet install` comand to set everything up for us.

8. If you browse to `http://localhost` through your Windows browser you should be presented with a Nginx 502 error bad gateway, this means everything is set up correctly, so far!

## Creating our Sites Directory

WSL automatically mounts your Window drives so they are accessible via the command line. All directories will be mounted at `/mnt/`. To set up Valet to park/link one of our folders, you'll need to do the following.

1. Set up a folder on your Windows drive where you want to store the files, for me this was `u/sites`.

2. Within Ubuntu, create a symbolink for your destination drive to your home folder with the following

   ```bash
   cd ~
   ln -s /mnt/u/sites
   ```

3. Park valet in the directory so that all subdirectories are automatically read.

   ```bash
   cd sites
   valet park
   ```

4. Create a subdirectory, e.g. `mysite`, and add a test file which presents some readable content to the browser, such as `<?php phpinfo();`

**Note:** If you try and access the in the browser at the minute this will not load, this is because we'll need to add it to our host file or setup wildcard domains on Windows, see the below steps.

## Wildcard Domains on Windows

Windows, by default, does not allow the ability to use wildcards in a hosts file. Now, you could manually add each site that you create in valet to your hosts file and be fine, but this adds an extra manual step. To combat this, we'll automate this with a tool called [Acrylic DNS Proxy](http://mayakron.altervista.org/wikibase/show.php?id=AcrylicHome).

Acrylic DNS Proxy is a tool which allows us to add an extra layer on our computer to catch and cache domains, it can be used for all sorts of purposes, but for our intent we want to set it up to read wildcard domains.

Download and install the software. Start the service from the start menu and double check that it is running through Windows Services. This can be disabled or enabled at will, either through the start menu or Windows Services.

Acrylic DNS Proxy uses a standalone hosts file on top of Windows, and you'll need to modify this with the wildcard parameters. In the start menu, find the Acrylic folder and open the hosts file. This will load a .txt file with comments providing examples of what you can do, add the following line at the bottom.

```bash
127.0.0.1 *.test
```

Save and then restart Acrylic.

All `.test` domains should now be served to your local (WSL) stack.

**Side Note**: You may get a 404 when you try and load the URLs in the browser, and I found that this was because my computer was not reading the host file properly. To get it to read the Acrylic host, I needed to modify my adapter settings so that the dns server was set to `127.0.0.1` for ipv4 and `::1` for ipv6. You can [read more about this here](http://mayakron.altervista.org/wikibase/show.php?id=AcrylicWindows10Configuration).

Everything should now be set up and working.

Happy Coding !
