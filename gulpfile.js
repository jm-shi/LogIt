var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var decomment = require('gulp-decomment');

gulp.task('minify', function() {
    return gulp.src(['./public/*.html', './public/css/*.css', './public/js/*.js', 
    '!./public/*.min.html', '!./public/css/*.min.css', '!./public/js/*.min.js'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(htmlmin({collapseInlineTagWhitespace: true}))
    .pipe(htmlmin({minifyCSS: true}))
    .pipe(htmlmin({minifyJS: true}))
    .pipe(htmlmin({minifyURLs: true}))
    .pipe(htmlmin({removeAttributeQuotes: true}))
    .pipe(htmlmin({removeEmptyAttribute: true}))
    .pipe(htmlmin({removeComments: true}))
    .pipe(htmlmin({removeRedundantAttributes: true}))
    .pipe(gulp.dest('./minified'));
});

gulp.task('decommentJS', ['minify'], function () {
    return gulp.src('./minified/*.js')
      .pipe(decomment({trim: true}))
      .pipe(gulp.dest('./minified'));
  });

gulp.task('renameHTML', ['minify'], function() {
    return gulp.src('./minified/*.html')
    .pipe(rename( { suffix: '.min'} ))
    .pipe(gulp.dest('./public'));
})

gulp.task('renameCSS', ['minify'], function() {
    return gulp.src('./minified/*.css')
    .pipe(rename( { suffix: '.min'} ))
    .pipe(gulp.dest('./public/css'));
})

gulp.task('renameJS', ['decommentJS'], function() {
    return gulp.src(['./minified/*.js'])
    .pipe(rename( { suffix: '.min'} ))
    .pipe(gulp.dest('./public/js'));
})

gulp.task('all', ['minify', 'decommentJS', 'renameHTML', 'renameCSS', 'renameJS']);