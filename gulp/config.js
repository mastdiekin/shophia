var util = require('gulp-util');

var production = util.env.production || util.env.prod || false;
var distPath = 'dist';
var sourcePath = 'app'
var config = {

	env              : 'development',
	production       : production,

	fontName         : 'myfont',
	docs: {
		root         : 'docs'
	},
	source: {
		root         : sourcePath,
		pages        : sourcePath +'/pages',
		assets       : sourcePath +'/assets',
		sass         : sourcePath +'/sass',
		sassRoot     : 'sass',
		fonts        : sourcePath +'/fonts',
		fontsRoot    : 'fonts',
		js           : sourcePath +'/js',
		images       : sourcePath +'/images',
		imagesRoot   : 'images',
		svg          : sourcePath +'/images/svg',
		libs         : sourcePath +'/libs'
	},
	dist: {
		root         : distPath,
		html         : distPath,
		styles       : distPath + '/styles',
		js           : distPath + '/js',
		images       : distPath + '/images',
		assets       : distPath + '/assets',
		fonts        : distPath + '/fonts',
		libs         : distPath + '/libs'
	},

	setEnv: function(env) {
		if (typeof env !== 'string') return;
		this.env = env;
		this.production = env === 'production';
		process.env.NODE_ENV = env;
	},

	logEnv: function() {
		util.log(
			'Environment:',
			util.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
		);
	},

	errorHandler: require('./helpers/handle-errors')
}

config.setEnv(production ? 'production' : 'development');

module.exports = config;