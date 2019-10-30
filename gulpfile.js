const gulp = require('gulp'),
	server = require('gulp-express'),
	sass = require('gulp-sass'),
	cleanCSS = require('gulp-clean-css'),
	cssbeautify = require('gulp-cssbeautify'),
	autoprefixer = require('gulp-autoprefixer'),
	runSequence = require('run-sequence');

gulp.task('sass:compile', function () {
	return gulp.src('./src/styles/main.scss')
		.pipe(sass({
			outputStyle: 'nested' // Options: nested, expanded, compact, compressed
		}).on('error', sass.logError))
		.pipe(cssbeautify({
			indent: '  ',
			autosemicolon: true
		}))
		.pipe(autoprefixer({
			browsers: ['last 3 versions'],
		}))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('./dist/styles'));
});

gulp.task('images:copy', function() {
	return gulp.src(['./src/images/*.*'])
		.pipe(gulp.dest('./dist/images/'));
});

gulp.task('server', function () {
	server.run(['server.js']);
})

gulp.task('server-build', function () {
	server.run(['server.js']);
	// runSequence('sass:compile', 'js:build', 'css:concat', 'fonts:copy', server.notify);
	runSequence('sass:compile', 'images:copy', server.notify);
});

gulp.task('watch', ['server-build'], function () {
	gulp.watch('./src/**/*.*', function (event) {
		runSequence('sass:compile', 'images:copy');
		server.notify(event);
	});
});

gulp.task('build', function () {
	runSequence('sass:compile', 'images:copy');
});

gulp.task('default', ['build']);