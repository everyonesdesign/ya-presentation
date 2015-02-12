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
                  styles: 'demo/styles.css',
                  keepRunner: true
              }
          }
      },
      watch: {
          scripts: {
              files: ['test/*.js', 'src/*.js'],
              tasks: ['test'],
              options: {
                  spawn: false
              }
          }
      }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('default', ['watch']);

};
