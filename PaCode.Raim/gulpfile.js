/// <binding ProjectOpened='default' />

var gulp = require('gulp');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var del = require('del');

var bundlesOutputDir = "Bundles";

var bundles = [
    {
        scripts: [
          "Content/moveDirections.js",
          "Content/keyboardInput.js",
          "Content/PlayersList.js",
          "Content/arena.js",
          "Content/raim.js",],
        output: "raim_main.js"
    }
];

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
