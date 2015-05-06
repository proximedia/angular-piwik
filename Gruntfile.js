module.exports = function (grunt)
{
    grunt.initConfig({
        concat: {
            options: {
                banner: "'use strict';\n"
            },
            dist: {
                src: ["src/core.js", "src/directives.js", "src/providers.js"],
                dest: "build/angular-piwik.js"
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: ["angular"]
                }
            },
            my_target: {
                files: {
                    "build/angular-piwik.min.js": ["build/angular-piwik.js"]
                }
            }
        },
        watch: {
            uglify: {
                files: "build/angular-piwik.js",
                tasks: "uglify"
            },
            concat: {
                files: "src/*.js",
                tasks: "concat"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", ["watch"]);
};