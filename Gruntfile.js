module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

  var js_files = [
    '**/*.js',
    '!node_modules/**/*',
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: js_files,
      options: {
        curly:     true,
        eqeqeq:    true,
        expr:      true,
        indent:    2,
        quotmark:  'single',
        trailing:  true,
        funcscope: true,
        asi:       false,
        boss:      true,
        unused:    false,
        eqnull:    false,
        es5:       false,
        node:      true,
        forin:     false,
        onevar:    true,
        evil:      true,
        immed:     false,
        laxbreak:  false,
        laxcomma:  true,
        noarg:     true,
        newcap:    true,
        strict:    true,
        noempty:   true,
        plusplus:  false,
        undef:     false,
        sub:       true,
        white:     false,
        loopfunc:  true,
        globals: {
          describe: true,
          it:       true,
          ROOT:     true,
          async:    true
        }
      }
    }
  });

};
