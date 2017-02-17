var gulp = require('gulp'); // Gulp!
var sass = require('gulp-sass'); // Converts SCSS to CSS
var browserSync = require('browser-sync').create(); // Local server stuff
var useref = require('gulp-useref'); // Concatenates things
var uglify = require('gulp-uglify'); // Minifies JS
var gulpIf = require('gulp-if'); // Helps with above
var cssnano = require('gulp-cssnano'); // Minifies SCSS
var imagemin = require('gulp-imagemin'); // Minifies images
var cache = require('gulp-cache'); // Caches images
var del = require('del'); // Deletes unused files
var runSequence = require('run-sequence'); // Builds in sequence

gulp.task('sass', function(){
  return gulp.src('app/scss/main.scss') // Don't need wildcards because partials
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref()) // Concatenates JS files
    .pipe(gulpIf('*.js', uglify())) // Minifies JS files
    .pipe(gulpIf('**/*.css', cssnano())) // Minifies CSS files
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({ // Minify images. Use caching because slow.
      interlaced: true // For exmaple
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/main.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images'],
    callback
  )
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
});
