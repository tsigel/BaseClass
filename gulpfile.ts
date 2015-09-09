/// <reference path="./typings/tsd.d.ts" />

import gulp = require('gulp');
import typescript = require('gulp-typescript');
import uglify = require('gulp-uglify');
import rename = require('gulp-rename');

gulp.task('default', () => {

    gulp.src('src/Base.ts')
        .pipe(typescript({
            module: 'commonjs'
        }))
        .pipe(uglify())
        .pipe(rename('Base.min.js'))
        .pipe(gulp.dest('build/'));

});