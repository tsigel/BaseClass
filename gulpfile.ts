/// <reference path="./typings/tsd.d.ts" />

/* tslint:disable */
import gulp = require('gulp');
import uglify = require('gulp-uglify');
import rename = require('gulp-rename');
import prc = require('child_process');
/* tslint:enable */

gulp.task('default', () => {

    prc.execSync('node node_modules/typescript/bin/tsc src/Base.ts -m UMD --sourceMap --outDir build');

    gulp.src('build/Base.js')
        .pipe(uglify())
        .pipe(rename('Base.min.js'))
        .pipe(gulp.dest('build/'));
});
