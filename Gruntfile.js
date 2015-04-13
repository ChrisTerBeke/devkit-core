/*
 *	    ____  ____  _____   ____________
 *	   / __ \/ __ \/  _/ | / /_  __/ __ \
 *	  / /_/ / /_/ // //  |/ / / / / /_/ /
 *	 / ____/ _, _// // /|  / / / / _, _/
 *	/_/   /_/ |_/___/_/ |_/ /_/ /_/ |_|
 *
 *	Copyright Printr B.V. All rights reserved.
 *	This code is closed source and should under
 *	no circumstances be copied or used in other
 *	applications that for Printr B.V.
 *
 */

module.exports = function(grunt) {
	window = {};

	require("./app/config/environment.js");
	var dependencies = require('./dependencies.json')

	var json = {
		pkg: grunt.file.readJSON('package.json'),

		/*
		 *	Clean folders before copying.
		 */
		clean: {
		  tmp: ["./public/tmp/*"],
		  assets: ["./public/assets/javascripts/*", "./public/assets/stylesheets/*"],
		  config: ["./public/config.js"]
		},

		/*
		 * Concatenate Javascript files
		 */
		concat: {
			options: {
				separator: ';\n'
			},
			tmp: {
				src: [
					/*
					 *	Include main files
					 */
					'./app/filters/**/*.js',
					'./app/services/**/*.js',
					'./app/directives/**/*.js',
					'./app/functions/**/*.js',
					'./app/app.js',
					'./app/routes.js',
					'./app/controllers/**/*.js'
				],
				dest: './public/tmp/tmp-js.js'
			},
			config: {
				src: [
					/*
					 *	Include configs
					 */
					'./app/config/helpers.js',
					'./app/config/environment.js',
					'./app/config/auth.js',
					'./app/config/path.js',
					'./app/config/include.js',
					'./app/config/debug.js'
				],
				dest: './public/tmp/tmp-config.js'
			},
			application_dependencies: {
				src: [

				],
				dest: './public/tmp/tmp-dependencies.js'
			},
			application_devDependencies: {
				src: [

				],
				dest: './public/tmp/tmp-devDependencies.js'
			},
			application_src: {
				src: [
					/*
					 *	Include configs
					 */
					'./public/tmp/tmp-config.js',

					/*
					 *	Include Application
					 */
					'./public/tmp/tmp-js.js',

					/*
					 *	Include Dependencies
					 */
					'./public/tmp/tmp-dependencies.js',
					'./public/tmp/tmp-devDependencies.js'
				],
				dest: './public/assets/javascripts/application.js'
			},
			application_dist: {
				src: [
					/*
					 *	Include configs
					 */
					'./public/tmp/tmp-config.min.js',

					/*
					 *	Include Application
					 */
					'./public/tmp/tmp-js.min.js',

					/*
					 *	Include Dependencies
					 */
					'./public/tmp/tmp-dependencies.js'
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
					'./public/tmp/tmp-js.min.js': './public/tmp/tmp-js.js',
					'./public/tmp/tmp-config.min.js': './public/tmp/tmp-config.js',
					'./public/tmp/tmp-dependencies.min.js': './public/tmp/tmp-dependencies.js'
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
				files: ['./public/tmp/**/*.js', './app/**/*.js'],
				tasks: ['js:' + ((window.ENV.type == 'development') ? 'dev' : 'dist'), 'clean:tmp']
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
	grunt.config.merge(dependencies);
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
	grunt.registerTask('build:config', ['clean:config', 'concat:config']);

	grunt.registerTask('js:dist', ['build:config', 'concat:tmp', 'concat:application_dependencies', 'uglify:main', 'concat:application_dist']);
	grunt.registerTask('js:dev', ['build:config', 'concat:tmp', 'concat:application_dependencies', 'concat:application_devDependencies', 'concat:application_src']);

  	grunt.registerTask('default', ['clean:assets', 'compass', 'js:' + ((window.ENV.type == 'development') ? 'dev' : 'dist'), 'compass', 'clean:tmp']);

};
