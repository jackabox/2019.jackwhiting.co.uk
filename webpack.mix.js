let mix = require('laravel-mix');
require('laravel-mix-purgecss');


mix.js('themes/twentytwenty/assets/js/app.js', 'static/js')
	 .postCss('themes/twentytwenty/assets/css/styles.css', 'static/css', [
	 		require('postcss-import'),
    	require('tailwindcss'),
    	require('autoprefixer')
   ])
  .purgeCss();
