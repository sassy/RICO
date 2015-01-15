"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('jshint', function() {
    return gulp.src([
        '*.js',
        'public/javascripts/*.js',
        'test/*.js'
    ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['jshint']);
