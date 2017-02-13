# kineticflow
The Kinetic Flow web app v2.0  

### The App

The app is built with JavaScript and jQuery. It is a frameworkless single page app.

Some basic, global functions (like `formatSeconds()`, for example) are in config.js.

Authentication is handled in auth.js.

Functions that change the users view (like `changeView()`) are stored in views.js.

Finally the things that control the app itself are in app.js.

### To run

Install browser-sync then run `browser-sync start --server --files='**/*.html, **/*.css, **/*.js'`
