const gulp = require('gulp')
const nodemon = require('nodemon')
const browserSync = require('browser-sync').create()
const less = require('gulp-less')
const cssmin = require('gulp-minify-css')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

gulp.task('default', ['less', 'browserSync'], function() {
	nodemon({
		script: 'app.js',
		ext: 'js',
		env: {'NODE_DEV': 'development'}
	})
})

gulp.task('browserSync', function() {
	browserSync.init({
		proxy: 'http://127.0.0.1:3000',
		// files: ['public/css/*.css', 'public/js/*.js', 'views/**'],
		browser: 'chrome',
		port: 8000
	})

	gulp.watch(['sql/**', 'public/css/*.css', 'public/js/*.js', 'views/**'])
		.on('change', browserSync.reload)
})

gulp.task('less', function() {
	gulp.watch('public/less/*.less', ['lesschange'])
})

gulp.task('lesschange', function() {
	gulp.src('public/less/*.less')
		.pipe(less())
		.pipe(cssmin())
		.pipe(gulp.dest('public/css'))
})

gulp.task('minjs', function() {
	gulp.src('public/js/*.js')
			.pipe(rename({suffix: '.min'}))
			.pipe(babel())
			.pipe(uglify())
			.pipe(gulp.dest('public/minjs'))
})