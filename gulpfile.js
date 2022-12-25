//var gulp = require('gulp'),
//    sass = require('gulp-ruby-sass'),
//    autoprefixer = require('gulp-autoprefixer'),
//    minifycss = require('gulp-minify-css'),
//    jshint = require('gulp-jshint'),
//    uglify = require('gulp-uglify'),
//    imagemin = require('gulp-imagemin'),
//    rename = require('gulp-rename'),
//    concat = require('gulp-concat'),
//    notify = require('gulp-notify'),
//    cache = require('gulp-cache'),
//    livereload = require('gulp-livereload'),
//    del = require('del'),
//    less = require('gulp-less'),
//    path = require('path'),
//    ngmin = require('gulp-ngmin'),
//    sourcemaps = require('gulp-sourcemaps'),
//    html2js = require('gulp-html2js'),
//    htmlmin = require('gulp-htmlmin'),
//    path = require('path'),
//    traceur = require('gulp-traceur');
//
////gulp.task('styles', function () {
////    return gulp.src('./apps/style/*.css')
////        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
////        .pipe(minifycss({keepBreaks: false}))
////        .pipe(concat('main.css'))
////        .pipe(rename({suffix: '.min'}))
////        .pipe(gulp.dest('dist/css'))
////        .pipe(notify({message: 'Styles task complete'}));
////});
//
//gulp.task('less', function () {
//    gulp.src('./less/all-ie-only.less')
//        .pipe(less())
//        .pipe(minifycss({keepBreaks: false}))
//        .pipe(gulp.dest('dist/less'));
//});
////
//gulp.task('htmlminifier', function () {
//    gulp.src('./apps/*.html')
//        .pipe(htmlmin({
//            collapseWhitespace: true,
//            collapseWhitespace: true,
//            minifyJS: true,
//            minifyCSS: true
//        }))
//        .pipe(gulp.dest('dist/minhtml'))
//        .pipe(notify({message: 'minify html task complete'}));
//});

//gulp.task('scriptsApps', function () {
//    return gulp.src('./apps/script/*.js')
//        .pipe(sourcemaps.init())
//        .pipe(concat('allapp.js'))
//        .pipe(rename({suffix: '.min'}))
//        .pipe(uglify())
//        .pipe(sourcemaps.write())
//        .pipe(gulp.dest('dist/scriptsApp'))
//        .pipe(notify({message: 'Scripts App task complete'}));
//});
//
//gulp.task('scripts', function () {
//    return gulp.src(['./scripts/controllers/*.js','./scripts/directives/*.js','./scripts/services/*.js'])
//        .pipe(concat('all.js'))
//        .pipe(gulp.dest('dist/scripts'))
//        .pipe(notify({message: 'Scripts task complete'}));
//});
// compile and concat es6 code into dist folder
//gulp.task('scripts', function () {
//
//    var traceurOptions = {
//        modules :'inline'
//    };
//
//    gulp.src(['./scripts/**/*.js', './scripts/*.js'])
//        .pipe(traceur(traceurOptions))
//        .pipe(concat('all.js'))
//        .pipe(gulp.dest('dist/scripts'))
//        .pipe(notify({message: 'Scripts task complete'}));
//});

//gulp.task('html2js', function () {
//    gulp.src(['./views/*.html', './views/templates/*.html'])
//        .pipe(html2js({
//            outputModuleName: 'main',
//            useStrict: true
//        }))
//        .pipe(concat('template.js'))
//        .pipe(gulp.dest('dist/template'))
//        .pipe(notify({message: 'html2js task complete'}));
//});
//
//gulp.task('imagesApp', function () {
//    return gulp.src('./apps/image/*')
//        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
//        .pipe(gulp.dest('dist/imageApp'))
//        .pipe(notify({message: 'Images App task complete'}));
//});
//
//gulp.task('images', function () {
//    return gulp.src('./image/*')
//        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
//        .pipe(gulp.dest('dist/image'))
//        .pipe(notify({message: 'Images task complete'}));
//});

//gulp.task('clean', function (cb) {
//    del(['dist/css', 'dist/image', 'dist/less', 'dist', 'dist/minhtml'], cb)
//});

//gulp.task('clear', function (done) {
//    return cache.clearAll(done);
//});
//
////gulp.task('default', ['clean', 'clear'], function () {
////    gulp.start('less', 'html2js', 'htmlminifier', 'scriptsApps', 'scripts', 'images', 'imagesApp');
////});
//
//gulp.task('default', ['clear'], function () {
//    gulp.start('less');
//});

//gulp.task('watch', function () {
//    //gulp.watch('./apps/style/*.css', ['styles']);
//
//    gulp.watch('./less/*.less', ['less']);
//
//    gulp.watch('./scripts/*.js', './scripts/**/*.js', ['scripts']);
//
//    gulp.watch('./apps/script/*.js', ['scriptsApps']);
//
//    gulp.watch('./views/*.html', './views/**/*.html', ['html2js']);
//
//    gulp.watch('./apps/*.html', ['htmlminifier']);
//
//    gulp.watch('./image/*', ['images']);
//
//    gulp.watch('./apps/image/*', ['imagesApp']);
//
//    // Create LiveReload server
//    livereload.listen();
//
//    // Watch any files in dist/, reload on change
//    gulp.watch(['dist/**']).on('change', livereload.changed);
//});
//
//
//
//
//
//

//
//var gulp = require('gulp'),
//    cache = require('gulp-cache'),
//    less = require('gulp-less'),
//    minifyCss = require('gulp-minify-css');


//
////npm install  gulp-minify-css  gulp-less gulp-cache  --save-dev
// Gulp task for creating template cache


//step by step - before upload prodaction
//    1. play gulp gulp-angular-templatecache - concat all js and html
//    2. add template module to module first
//    3. put module controller and services and directives before my groups
//    4. minify all js - play gulp-ngmin
//    5. change version after tag script like this: <script src="dist/min/all-min.js?ver=0.1"></script>

var os = require('os');

os.tmpDir = os.tmpdir;
var gulp = require('gulp'),
	ngmin = require('gulp-ngmin'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less');

// concat = require('gulp-concat'),
// cache = require('gulp-cache'),
// angularTemplateCache = require('gulp-angular-templatecache'),
// addStream = require('add-stream');

// function prepareTemplates() {
// 	return gulp.src(['views/*.html', 'views/**/*.html'])
// 	.pipe(angularTemplateCache());
// }
// gulp.task('preMin', function () {
// 	return gulp.src(['scripts/*.js', 'scripts/lib/*.js', 'scripts/controllers/*.js', 'scripts/directives/*.js', 'scripts/services/*.js'])
//
// 	// append the template js onto app.js
// 	.pipe(addStream.obj(prepareTemplates()))
// 	.pipe(concat('app.js'))
//
// 	//.pipe(ng annotate, minify, etc)
// 	.pipe(gulp.dest('dist'));
// });

// gulp.task('prodMin', function () {
// 	gulp.start('main');
// 	gulp.start('lib');
// 	gulp.start('controllers');
// 	gulp.start('directives');
// 	gulp.start('services');
// });

// gulp.task('prodMin',
// 	gulp.series('main', 'lib', 'controllers', 'directives', 'services',  function() {
//
// 	})
// );
//


// gulp.task('template', function () {
// 	return gulp.src(['views/*.html', 'views/**/*.html'])
// 	.pipe(angularTemplateCache())
// 	.pipe(concat('templateCache.js'))
// 	.pipe(gulp.dest('dist'));
// });

// gulp.task('main', function () {
// 	gulp.src(['scripts/*.js'])
// 	.pipe(ngmin())
// 	.pipe(uglify())
// 	.pipe(gulp.dest('dist/scripts'));
// });
// gulp.task('lib', function () {
// 	gulp.src(['scripts/lib/*.js'])
// 	.pipe(ngmin())
// 	.pipe(uglify())
// 	.pipe(gulp.dest('dist/scripts/lib'));
// });
// gulp.task('controllers', function () {
// 	gulp.src(['scripts/controllers/*.js'])
// 	.pipe(ngmin())
// 	.pipe(uglify())
// 	.pipe(gulp.dest('dist/scripts/controllers'));
// });
// gulp.task('directives', function () {
// 	gulp.src(['scripts/directives/*.js'])
// 	.pipe(ngmin())
// 	.pipe(uglify())
// 	.pipe(gulp.dest('dist/scripts/directives'));
// });
// gulp.task('services', function () {
// 	gulp.src(['scripts/services/*.js'])
// 	.pipe(ngmin())
// 	.pipe(uglify())
// 	.pipe(gulp.dest('dist/scripts/services'));
// });

const {series, parallel} = require('gulp');



function main(cb) {
	gulp.src(['scripts/*.js'])
	.pipe(ngmin())
	.pipe(uglify())
	.pipe(gulp.dest('dist/scripts'));
	cb();
}

function lib(cb) {
	gulp.src(['scripts/lib/*.js'])
	.pipe(ngmin())
	.pipe(uglify())
	.pipe(gulp.dest('dist/scripts/lib'));
	cb();
}

function controllers(cb) {
	gulp.src(['scripts/controllers/*.js'])
	.pipe(ngmin())
	.pipe(uglify())
	.pipe(gulp.dest('dist/scripts/controllers'));
	cb();
}

function directives(cb) {
	gulp.src(['scripts/directives/*.js'])
	.pipe(ngmin())
	.pipe(uglify())
	.pipe(gulp.dest('dist/scripts/directives'));
	cb();
}

function services(cb) {
	gulp.src(['scripts/services/*.js'])
	.pipe(ngmin())
	.pipe(uglify())
	.pipe(gulp.dest('dist/scripts/services'));
	cb();
}

// exports.build = series(parallel(main, lib, controllers,directives, services));
gulp.task('prodMin', gulp.series(main, lib, controllers,directives, services, function () {
	// default task code here
}));
// node ./node_modules/gulp/bin/gulp.js prodMin


function lessAll(cb) {
	gulp.src(['less/styles.less'])
	.pipe(less())
	.pipe(gulp.dest('dist'));
	cb();
}
gulp.task('lessAll', gulp.series(lessAll, function () {
// default task code here
}));
// node ./node_modules/gulp/bin/gulp.js lessAll
