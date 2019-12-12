let mix = require('laravel-mix');
require('laravel-mix-purgecss');


mix.js('themes/twentytwenty/assets/js/app.js', 'static/js')
	 .postCss('themes/twentytwenty/assets/css/styles.css', 'static/css', [
	 		require('postcss-import'),
    	require('tailwindcss'),
    	require('autoprefixer')
   ])
  .purgeCss({
    globs: [
      path.join(__dirname, 'themes/twentytwenty/layouts/**/*.html'),
      path.join(__dirname, 'themes/twentytwenty/assets/css/*.css'),
      path.join(__dirname, 'themes/twentytwenty/assets/js/*.js'),
      path.join(__dirname, 'content/**/*.md'),
    ],
  	whitelistPatterns: [/highlight/, /commento/],
    whitelistPatternsChildren: [/^highlight$/, /^commento$/, /^pagination$/],
  });
