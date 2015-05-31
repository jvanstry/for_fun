var gulp = require('gulp');
var browserify = require('browserify');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');

var clientScripts = ['./public/javascripts/*.js', './public/main.js'];
var testScripts = './test/client/*.js';
var clientEntry = './public/main.js';
var testEntry = './test/main.js';

gulp.task('browserify-tests', function () {
  return browserify(testEntry)
    .bundle()
    .pipe(source('test-bundle.js'))
    .pipe(gulp.dest('./test/'));
});

gulp.task('browserify-client', function () {
  return browserify(clientEntry)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('test', ['browserify-client', 'browserify-tests'], function () {
    return gulp
    .src('test/runner.html')
    .pipe(mochaPhantomJS());
});

gulp.task('watch', function() {
  gulp.watch(clientScripts, ['browserify-client', 'test']);
  gulp.watch(testScripts, ['browersify-tests', 'test']);
});