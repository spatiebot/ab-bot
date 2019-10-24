var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('copy-data', function() {
    return gulp.src('./data/*.json')
        .pipe(gulp.dest('./dist/data/'));
});

gulp.task('default', gulp.parallel('copy-data', 'compile'));