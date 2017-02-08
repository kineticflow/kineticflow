# kineticflow
The Kinetic Flow web app v2.0  

To run locally run `cd sites/kineticflow && browser-sync start --server --files='**/*.html, **/*.css, **/*.js'`

Audio tags matrix - https://docs.google.com/spreadsheets/d/1uJb3vlQ7-Fl5Gt9kx_JXSJKRxRzP3T1pSXs4BkRfMzI/edit?ts=5891e916#gid=566444785

Content - https://drive.google.com/drive/folders/0B1TgHAAvV7b7eXFERVR5RzFub0U

### EY Tasks
1. Start work calm and focussed
2. Re energise and get productive
3. Prepare for an important meeting
4. Decompress after your workday
5. Put your day down and relax into sleep
6. Kick off a group meeting (group, no mood)
7. Prioritise and get things finished (need to confirm title)

### The App

The app is build using JavaScript and jQuery. It is a frameworkless single page app.

Some basic, global functions (like `formatSeconds()`, for example) are in config.js.

Authentication and user profile things are handled in auth.js.

Functions that change the users view (like `changeView()`) are stored in views.js.

Finally the things that control the app itself are in app.js. 
