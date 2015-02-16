module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
        debounceDelay: 250
      },
      less_main: {
        files: './css/**/*.less',
        tasks: ['less']
      }
    },

    less: {
      main: {
        files: {
          './css/style.css': './css/style.less'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

};