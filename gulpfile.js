"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var mainBowerFiles = require('main-bower-files');

gulp.task('jshint', function() {
    return gulp.src([
        '*.js',
        'public/javascripts/*.js',
        'test/*.js'
    ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('mocha', function() {
    return gulp.src(['test/*.js'], {read: false})
      .pipe($.mocha({reporter : 'spec'}))
      .on('error', $.util.log)
      .on('end', function() {
          process.exit();
      });
});

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
      .pipe(gulp.dest('./public/libs'));
});

gulp.task('cover', function() {
    return gulp.src([
        '*.js',
        'public/javascripts/*.js',
        'test/*.js'
    ])
        .pipe($.istanbul())
        .pipe($.istanbul.hookRequire())
        .on('end', function() {
            gulp.src(['test/*.js'])
                .pipe($.mocha({reporter : 'spec'}))
                .pipe($.istanbul.writeReports(
                ))
                .on('end', function() {
                    process.exit();
                });
        });
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
gulp.task('test', ['mocha']);
