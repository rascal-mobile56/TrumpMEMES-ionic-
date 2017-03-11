var gulp = require('gulp');

var requireDir = require('require-dir');
requireDir('./gulp-tasks');
var jshint = require('gulp-jshint');

gulp.task('default', ['sass', 'templatecache']);
gulp.task('lint', function() {
  return gulp.src('./www/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
