/// <reference path="./typings/tsd.d.ts" />

import gulp = require('gulp');
import typescript = require('gulp-typescript');
import uglify = require('gulp-uglify');

gulp.task('common', () => {

    gulp.src('src/Base.ts')
        .pipe(typescript({
            module: 'commonjs'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build/'));

});

gulp.task('AMD', () => {

    gulp.src('src/Base.ts')
        .pipe(typescript({
            module: 'AMD'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build/'));

});

gulp.task('default', ['common']);