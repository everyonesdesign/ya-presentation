/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    builtFolder: 'built',
      jasmine: {
          pivotal: {
              src: 'src/ya-presentation.js',
              options: {
                  specs: 'test/*.js',
                  outfile: 'test/spec_run.html',
                  vendor: 'bower_components/jquery/dist/jquery.min.js',
                  styles: ['demo/styles.css', 'dest/ya-presentation.css'],
                  keepRunner: true
              }
          }
      },
      watch: {
          default: {
              files: ['test/*.js', 'src/*.js', 'src/*.css'],
              tasks: ['run'],
              options: {
                  spawn: false
              }
          }
      },
      copy: {
          js: {
              src: 'src/ya-presentation.js',
              dest: 'dest/ya-presentation.js'
          },
          css: {
              src: 'src/ya-presentation.css',
              dest: 'dest/ya-presentation.css'
          }
      },
      uglify: {
          main: {
              files: {
                  'dest/ya-presentation.min.js': ['src/ya-presentation.js']
              }
          }
      }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('run', ['copy', 'uglify', 'test']);
  grunt.registerTask('default', ['watch']);

};
