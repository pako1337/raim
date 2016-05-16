/// <binding />
var gulp = require('gulp');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var del = require('del');
var bundles = require('./Bundles.json');

var bundlesOutputDir = "Bundles";

gulp.task('clean', function () {
    del(bundlesOutputDir + '/*');
});

gulp.task('bundling', function () {
    bundles.forEach(function (bundle) {
        gulp.src(bundle.scripts)
            .pipe(concat(bundle.output))
            .pipe(gulp.dest(bundlesOutputDir));
    });
});

gulp.task("watch", function () {
    bundles.forEach(function (bundle) {
        gulp.watch(bundle.scripts, ['clean', 'bundling']);
    });
});

gulp.task('default', ['clean', 'bundling', 'watch']);
