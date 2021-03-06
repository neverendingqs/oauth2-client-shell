var jsFiles = ['**/*.js', '!**/*.min.js', '!node_modules/**/*.js'];

module.exports = function(grunt) {

  grunt.initConfig({

    env: {
      dev: {
        src: ".env"
      }
    },

    jshint: {
      all: jsFiles,
      options: {
          jshintrc: '.jshintrc'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'mocha.log', // Optionally capture the reporter output to a file
        },
        src: ['test/**/*.js']
      }
    },

    watch: {
      js: {
        files: jsFiles,
        tasks: ['jshint']
      }
    },

    nodemon: {
      dev: {
        script: 'server-local.js'
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['nodemon', 'watch']
    }

  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['env:dev', 'jshint', 'concurrent']);
  grunt.registerTask('test', ['jshint', 'mochaTest']);
};
