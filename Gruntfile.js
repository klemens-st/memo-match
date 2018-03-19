module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      dist: {
        src: [
          'js/utils.js',
          'js/game-controller.js',
          'js/score-controller.js',
          'js/timer.js',
          'js/leader-board.js',
          'js/modal.js',
          'js/main.js'
        ],
        dest: 'js/built/main.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);

};