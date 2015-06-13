var gulp  = require("gulp");
var notify = require("gulp-notify");
var less = require('gulp-less');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

var ENV = process.env.NODE_ENV || 'development';
console.log('Running with NODE_ENV = ', ENV);

// default error handler for stage/prod (exit with status 1)
var errorHandler = function(err) {
  console.log(err.message);
  console.log('FAILED - exit(1)');
  process.exit(1);
};

// use gulp-notify in development
if (ENV === 'development') {
  errorHandler = notify.onError(function(e) { return e.message; });
}

gulp.task('less', function() {
  return gulp.src('app/styles/*/*.less')
    .on('error', errorHandler)
    .pipe(less())
    .pipe(concat('client.css'))
    .pipe(autoprefixer({
      browsers: ['last 5 iOS versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/public/stylesheets'));
});

gulp.task('default', ['less', 'js'], function() {
  gulp.watch(['app/styles/*/*.less'], ['less']);
  gulp.watch(['app/libs/*.js'],['js']);
});

gulp.task('js', function() {
  return gulp.src('app/libs/*.js')
  .on('error', errorHandler)
  .pipe(concat('client.js'))
  .pipe(gulp.dest('app/public/js'));
});
