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
 * Deploy all relevant pages to the dist folder.
 */
gulp.task('build-pages', function (cb) {
	const products = require('./src/modules/products.js');
	return gulp.src("./src/pages/**/*.html")
		.pipe(using())
		.pipe(dom(function() {
			["compendiums", "applications", "classes", "social", "support"].forEach((x) => {
				[...this.querySelectorAll(`.products--${x}`)].map((y) => y.innerHTML = products[x].map((z) => _renderProduct(z)).join(''));
			});
			return this;
		}))
		.pipe(beautify.html({ indent_with_tabs: true }))
		.pipe(gulp.dest('./dist/'));
	
	function _renderProduct(product) {
		return `
			<div class="feature feature--product" id="${product.code}">
				<div class="feature__icon">
					<img src="${product.icon.src}" alt="${product.title}">
				</div>
				<div class="feature__body">
					<h5 class="feature__title"><a href="#${product.code}">${product.title}</a></h5>
					<div class="feature__description">
						<div class="feature__icon">
							<img src="${product.icon.src}" alt="${product.title}">
						</div>
						${product.description}
					</div>
					<ul class="feature__tags">
						${product.tags.map((x) => `<li>${x}</li>`).join('')}
					</ul>
					<ul class="feature__actions">
						${product.actions.map((x) => `<li>${x}</li>`).join('')}
					</ul>
				</div>
			</div>
		`;
	}
});

/*
 * Deploy all relevant htaccess files to the dist folder.
 */
gulp.task('build-htaccess', function (cb) {
	return gulp.src("./src/pages/**/.htaccess")
		.pipe(using())
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
	gulp.watch('./src/pages/**/.htaccess', gulp.series(['build-htaccess']));
	gulp.watch('./src/stylesheets/**/*.scss', gulp.series(['build-stylesheets']));
	gulp.watch('./src/server/**/*.*', gulp.series(['build-server']));
});

/*
 * Master build tasks.
 */
gulp.task('build', gulp.series('purge', gulp.parallel('build-server', 'build-images', 'build-pages', 'build-stylesheets', 'build-htaccess'), function(cb) {
	return cb();
}));
gulp.task('build-and-watch', gulp.series('build', 'watch'));


