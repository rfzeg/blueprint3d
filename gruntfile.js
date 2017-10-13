module.exports = function (grunt) {

  require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

  var globalConfig = {
    moduleName: "blueprint3d",
    sources: ["src/*.ts", "src/*/*.ts"],
    outDir: "dist",
    docDir: "doc",
    exampleDir: "example/js/"
  };

  var configuration = {
    clean: [
        globalConfig.outDir,
        globalConfig.docDir,
        globalConfig.exampleDir + "/" + globalConfig.moduleName + ".js",
        globalConfig.exampleDir + "/three.min.js"]
  };

  configuration.copy = {};
  configuration.copy[globalConfig.moduleName] = {
    src: globalConfig.outDir + "/" + globalConfig.moduleName + ".js",
    dest: globalConfig.exampleDir + "/" + globalConfig.moduleName + ".js"
  };

    configuration.watch = {
        scripts: {
            files: ['src/**/*.ts'],
            tasks: ['compile', 'example'],
            options: {
                //interrupt: true,
                spawn: false,
            }
        }
    };

  configuration.browserSync = {
      dev: {
          bsFiles: {
              src: 'example/js/*.js'
          },
          options: {
              server: {
                  watchTask: true,
                  baseDir: "./example"
              }
          }
      }
  };

  configuration.copy.threejs = {
    src: "node_modules/three/three.min.js",
    dest: globalConfig.exampleDir + "/three.min.js"
  };

  configuration.typescript = {
    options: {
      target: "es5",
      declaration: true,
      sourceMap: true,
      removeComments: false
    }
  };

  configuration.typescript[globalConfig.moduleName] = {
    src: globalConfig.sources,
    dest: globalConfig.outDir + "/" + globalConfig.moduleName + ".js"
  };

  configuration.concurrent = {
      target1: ["browserSync", "watch"]
  };

  configuration.typedoc = {
    options: {
      name: globalConfig.moduleName,
      target: "es5",
      mode: "file",
      readme: "none"
    }
  };

  configuration.typedoc[globalConfig.moduleName] = {
    options: {
      out: globalConfig.docDir + "/" + globalConfig.moduleName,
      name: globalConfig.moduleName
    },
    src: globalConfig.sources
  };

  configuration.uglify = {
    options: {
      mangle: true,
      beautify: false,
      sourceMap: true
    }
  };
  configuration.uglify[globalConfig.moduleName] = {
    files: {}
  };

  configuration.uglify[globalConfig.moduleName].files["dist/" + globalConfig.moduleName + ".min.js"] = globalConfig.outDir + "/" + globalConfig.moduleName +".js";

  grunt.initConfig(configuration);

  grunt.registerTask("compile", [
    "typescript:" + globalConfig.moduleName
  ]);

  grunt.registerTask("example", [
    "copy:threejs",
    "copy:" + globalConfig.moduleName
  ]);

  grunt.registerTask("release", [
    "clean",
    "compile",
    "uglify:" + globalConfig.moduleName,
    "typedoc:" + globalConfig.moduleName
  ]);

  grunt.registerTask("default", [
    "clean",
    "compile",
    "example",
    "concurrent:target1"
  ]);

    grunt.event.on('watch', function(action, filepath, target) {
        //grunt.config(configuration.typescript[globalConfig.moduleName].src, filepath);
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });
};
