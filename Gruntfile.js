module.exports = function (grunt)
{
    grunt.initConfig({
        uglify: {
            options: {
                mangle: {
                    except: ['angular']
                }
            },
            my_target: {
                files: {
                    "build/angular-piwik.min.js": ["src/angular-piwik.js"]
                }
            }
        },
        watch: {
            files: ["src/angular-piwik.js"],
            tasks: ["uglify"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", ["uglify"]);
};