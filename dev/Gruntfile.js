var admin_src = 'client/admin';
var user_src = 'client/user';
var out = 'www';
var lib = 'client/lib';

var admin_dest = `${out}/admin`;
var user_dest = `${out}/user`;

var ts_options = {
    module: 'amd',
    target: 'es5',
    removeComments: true,
    sourceMap: false,
};
module.exports = function (grunt) {
    grunt.initConfig({
        // 通过connect任务，创建一个静态服务器
        connect: {
            www: {
                options: {
                    // 服务器端口号
                    port: 2015,
                    // 服务器地址(可以使用主机名localhost，也能使用IP)
                    // hostname: '192.168.1.7',
                    hostname: '0.0.0.0',
                    // keepalive: true,
                    livereload: 20454,
                    // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
                    base: './',
                    open: true,
                    // protocol: 'https'
                }
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: 20454 //监听前面声明的端口  35729
                },
                files: [
                    `dev/**/*`
                ]
            }
        }
    });

    //===============================================================
    // grunt.event.on('watch', function (action, filepath, target) {
    //     grunt.log.writeln(`action:${action}\n`);
    //     grunt.log.writeln(`filepath:${filepath}\n`);
    //     grunt.log.writeln(`target:${target}\n`);

    //     let arr = filepath.split(/\/|\\/);
    //     arr.shift();
    //     arr[0] = 'www';
    //     let target_pathname = arr.join('/');//filepath.replace('out\es6', 'www');
    //     grunt.log.writeln(`target_pathname:${target_pathname}\n`);

    //     grunt.file.copy(filepath, `${target_pathname}`);

    // });
    //===============================================================

    // grunt.loadNpmTasks('grunt-babel');
    // grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-connect');
    // grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-contrib-less');
    // grunt.loadNpmTasks('grunt-contrib-requirejs');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.registerTask('common', ['less', 'copy:client']);

    // grunt.registerTask('build-es6', ['shell', 'copy:lib_es6']);
    // grunt.registerTask('build-es5', ['shell', 'copy:lib_es5', 'copy:lib_es6', 'babel']);
    // grunt.registerTask('run', ['connect', 'watch']);

    // grunt.registerTask('es5-debug', ['common', 'build-es5', 'copy:es5_www', 'requirejs']);
    // grunt.registerTask('release', ['common', 'build-es5', 'copy:es5_www', 'uglify', 'requirejs']);
    grunt.registerTask('dev', ['connect', 'watch']);
}

