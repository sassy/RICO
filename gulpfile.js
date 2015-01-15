"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

gulp.task('jshint', function() {
    return gulp.src([
        '*.js',
        'public/javascripts/*.js',
        'test/*.js'
    ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
    browserSync.init({
        server:{
            baseDir: "./"
        },
        notify: false
    });
    gulp.watch(['*.js',
        'public/javascripts/*.js',
        'test/*.js'], ['jshint'], browserSync.reload);
});

gulp.task('default', ['watch']);
