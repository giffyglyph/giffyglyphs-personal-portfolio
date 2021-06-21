'use strict';

const del = require('del');
const gulp = require('gulp');
const dom = require('gulp-dom');
const beautify = require('gulp-beautify');
const using = require('gulp-using');
const sourcemaps = require('gulp-sourcemaps');
const minimist = require('minimist');
const sass = require('gulp-sass');

/*
 * Deploy all relevant images to the dist folder.
 */
gulp.task('build-images', function (cb) {
	return gulp.src("./src/images/**/*.+(jpg|jpeg|gif|png|svg)")
		.pipe(using())
		.pipe(gulp.dest('./dist/images'));
});

/*
 * Deploy all server-side files to the server folder.
 */
gulp.task('build-server', function (cb) {
	return gulp.src("./src/server/**/*.*")
		.pipe(using())
		.pipe(gulp.dest('./dist/server'));
});

/*
 * Deploy all relevant fonts to the dist folder.
 */
gulp.task('build-pages', function (cb) {
	return gulp.src("./src/pages/**/*.html")
		.pipe(using())
		.pipe(dom(function() {
			return this;
		}))
		.pipe(beautify.html({ indent_with_tabs: true }))
		.pipe(gulp.dest('./dist/'));
});

/*
 * Deploy all relevant stylesheets to the dist folder.
 */
gulp.task('build-stylesheets', function (cb) {
	if (minimist(process.argv).dev) {
		return gulp.src("./src/stylesheets/**/*.scss")
			.pipe(using())
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./dist/stylesheets'));
	} else {
		return gulp.src("./src/stylesheets/**/*.scss")
			.pipe(using())
			.pipe(sass({outputStyle: 'compressed'}))
			.pipe(gulp.dest('./dist/stylesheets'));
	}
});

/*
 * Purge all build content.
 */
gulp.task('purge', function (cb) {
	return del("dist");
});

/*
 * Watch folders for any changes.
 */
gulp.task('watch', function(cb) {
	gulp.watch('./src/images/**/*.+(jpg|jpeg|gif|png|svg)', gulp.series(['build-images']));
	gulp.watch('./src/pages/**/*.html', gulp.series(['build-pages']));
	gulp.watch('./src/stylesheets/**/*.scss', gulp.series(['build-stylesheets']));
	gulp.watch('./src/server/**/*.*', gulp.series(['build-server']));
});

/*
 * Master build tasks.
 */
gulp.task('build', gulp.series('purge', gulp.parallel('build-server', 'build-images', 'build-pages', 'build-stylesheets'), function(cb) {
	return cb();
}));
gulp.task('build-and-watch', gulp.series('build', 'watch'));


