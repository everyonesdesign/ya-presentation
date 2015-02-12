/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    builtFolder: 'built',
      jasmine: {
          pivotal: {
              src: 'test/*.js',
              options: {
                  specs: '*.js'
              }
          }
      }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task.
  grunt.registerTask('test', ['jasmine']);

};
