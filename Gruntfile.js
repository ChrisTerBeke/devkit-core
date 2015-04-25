
module.exports = function(grunt) {
	window = {};

	require("./app/config/environment.js");

	var json = {
		/*
		 *	Clean folders before copying.
		 */
		clean: {
		  assets: ["./public/assets/javascripts/*", "./public/assets/stylesheets/*"],
		  config: ["./public/config.js"]
		},

		concat: {
			options: {
				separator: ';\n'
			},
			files: {
				src: [

					/*
					 *	Include configs
					 */
					'./app/config/helpers.js',
					'./app/config/environment.js',
					'./app/config/auth.js',
					'./app/config/path.js',
					'./app/config/include.js',
					'./app/config/debug.js',

					/*
					 *	Angular and its main dependencies.
					 */
					'./bower_components/angular/angular.js',
					'./bower_components/angular-resource/angular-resource.js',
					'./bower_components/angular-animate/angular-animate.js',
					'./bower_components/angular-sanitize/angular-sanitize.js',

					/*
					 *	Angular vendor dependencies.
					 */
					'./bower_components/angular-ui-codemirror/ui-codemirror.js',
					'./bower_components/angular-hotkeys/build/hotkeys.js',
					'./bower_components/ng-tags-input/ng-tags-input.js',

					/*
					 *	Load modules.
					 */
					'./core/modules/angular.js',
					'./core/modules/vendor.js',
					'./core/modules/filters.js',
					'./core/modules/services.js',
					'./core/modules/core.js',

					/*
					 *	Include source files
					 */
					'./core/dependencies/**/*.js',
					'./core/filters/**/*.js',
					'./core/services/**/*.js',
					'./core/directives/**/*.js',

					/*
					 *	Include main files
					 */
					'./bower_components/codemirror/lib/codemirror.js',
					'./bower_components/codemirror/mode/javascript/javascript.js',

					/*
					 *	Include core
					 */
					'./core/app.js',
					'./core/controllers/**/*.js',

					/*
					 *	Include app specific files
					 */
					'./app/**/*.js',
				],
				dest: './public/assets/javascripts/application.js'
			}
		},

		/*
		 * Uglify Javascript files
		 */
		uglify: {
			options: {
				mangle: true  // Use if you want the names of your functions and variables unchanged
			},
			main: {
				files: {
					'./public/assets/javascripts/application.js': './public/assets/javascripts/application.js'
				}
			}
		},

		/*
		 * Initialise Compass SASS
		 */
		compass: {
			dist: {
				options: {
					config: './compass.rb',
					environment: window.ENV.type
				}
			}
		},

		/*
		 * Watch for changes in directories
		 */
		watch: {
			javascripts: {
				files: ['./public/tmp/**/*.js', './core/**/*.js', './app/**/*.js'],
				tasks: ['js:' + ((window.ENV.type == 'development') ? 'dev' : 'dist')]
			},
			sass: {
				files: ['./sass/**/*.scss', './css-base/dist/**/*.scss'],
				tasks: ['compass']
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: [],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['package.json', 'bower.json'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'origin',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
				globalReplace: false,
				prereleaseName: false,
				regExp: false
			}
		}
	}

	grunt.initConfig();
	grunt.config.merge(json);

	/*
	 * Load NPM Plugins
	 */
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-bump');

	/*
	 * Register Tasks
	 */
	grunt.registerTask('build:config', ['clean:config']);

	grunt.registerTask('js:dist', ['build:config', 'concat:', 'uglify']);
	grunt.registerTask('js:dev', ['build:config', 'concat']);

  	grunt.registerTask('default', ['clean:assets', 'compass', 'js:' + ((window.ENV.type == 'development') ? 'dev' : 'dist'), 'compass']);

};
