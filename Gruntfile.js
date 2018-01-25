module.exports = function(grunt) {
  'use strict';
  // Load tasks automatically with 'load-grunt-tasks' plugin.
  require('load-grunt-tasks')(grunt);

  var themeDir = 'docroot/themes/front';
  var sassLib = ['bower_components'];
  var sassFiles = {};
  sassFiles[themeDir + '/css/style.css'] = themeDir + '/scss/style.scss';
  sassFiles[themeDir + '/css/print.css'] = themeDir + '/scss/print.scss';


  // Project configuration.
  grunt.initConfig({
    sass: {
      dev: {
        options: {
          sourceMap: true,
          outputStyle: 'expanded',
          includePaths: sassLib
        },
        files: sassFiles,
      },
      build: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed',
          includePaths: sassLib
        },
        files: sassFiles,
      }
    },
    postcss: {
      dev: {
        options: {
          map: {
            inline: false
          },
          processors: [
            require('autoprefixer-core')({browsers: ['last 2 versions', 'ie 9']}) // add vendor prefixes
          ]
        },
        src: themeDir + '/css/*.css'
      },
      build: {
        options: {
          map: false,
          processors: [
            require('autoprefixer-core')({browsers: ['last 2 versions', 'ie 9']}),
            // require('cssnano')() //minify final output
          ]
        },
        src: themeDir + '/css/*.css'
      }
    },
    watch: {
      sass: {
        files: ['front/**/*.scss'],
        tasks: ['sass:dev', 'postcss:dev'],
      }
    },
  });

  // Default task(s).
  grunt.registerTask('default', ['sass:build']);

  grunt.registerTask('dev', ['sass:dev', 'postcss:dev']);

  grunt.registerTask('build', ['sass:build', 'postcss:build']);

};