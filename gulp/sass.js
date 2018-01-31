var config             = require('./config');
var server             = require('./server');
var gulp               = require('gulp');
var sass               = require('gulp-sass');
var wait               = require('gulp-wait');
var sourcemaps         = require('gulp-sourcemaps');
var reportError        = require('./helpers/handle-errors');
var bourbon            = require('node-bourbon');
var postcss            = require('gulp-postcss');
var util               = require('gulp-util');
var mqpacker           = require('css-mqpacker');
var autoprefixer       = require('gulp-autoprefixer');
var concat             = require('gulp-concat');
var rename             = require('gulp-rename');
var csso               = require('postcss-csso');
var cssnano            = require('gulp-cssnano');
var sassInheritance    = require('gulp-sass-inheritance'); //gulp-sass-inheritance
var cached             = require('gulp-cached'); //gulp-sass-inheritance
var gulpif             = require('gulp-if'); //gulp-sass-inheritance. dont delete
var filter             = require('gulp-filter'); //gulp-sass-inheritance

//Сортировка медиа запросов
function isMax(mq) {
	return /max-width/.test(mq);
}

function isMin(mq) {
	return /min-width/.test(mq);
}

function sortMediaQueries(a, b) {
	A = a.replace(/\D/g, '');
	B = b.replace(/\D/g, '');

	if (isMax(a) && isMax(b)) {
		return B - A;
	} else if (isMin(a) && isMin(b)) {
		return A - B;
	} else if (isMax(a) && isMin(b)) {
		return 1;
	} else if (isMin(a) && isMax(b)) {
		return -1;
	}

	return 1;
}

gulp.task('sass', function(){
	return gulp.src(config.source.sass + '/**/*.{sass,scss}')
		.pipe(gulpif(global.isWatching, cached('sass')))
		.pipe(sassInheritance({dir: config.source.sass}))
		.pipe(filter(function (file) {
			return !/\/_/.test(file.path) || !/^_/.test(file.relative);
		}))
		.pipe(sourcemaps.init())
		.pipe(wait(50))
		.pipe(sass.sync({
			outputStyle: config.production ? 'compact' : 'expanded',
			includePaths: require('node-bourbon').with(config.source.sass)
		}).on('error', reportError))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(postcss([
			mqpacker({
				sort: sortMediaQueries
			}),
			csso
		]).on('error', reportError))
		.pipe(config.production ? util.noop() : sourcemaps.write('../styles/maps'))
		.pipe(gulp.dest(config.dist.styles))
		.pipe(server.reload({stream: true}));
});

gulp.task('setWatch', function() { //gulp-sass-inheritance
	global.isWatching = true;
});

gulp.task('libs', function(){
	return gulp.src([
		config.dist.styles +'/lib/bootstrap.css',
		config.dist.styles +'/style.css',
		])
		.pipe(concat('all.css'))
		.pipe(cssnano({
			reduceIdents: false
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.dist.styles))
		.pipe(server.reload({stream: true}));
});