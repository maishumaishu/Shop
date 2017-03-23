var admin_dest = 'www';
var admin_root = 'src';
var user_dest = 'user_www';
var user_root = 'user';
var ts_options = {
    module: 'amd',
    target: 'es5',
    removeComments: true,
    // references: [
    //     admin_root + "/js/typings/*.d.ts"
    // ],
    sourceMap: false,
};
module.exports = function (grunt) {
    grunt.initConfig({
        shell: {
            admin: {
                command: 'tsc -p src',
                options: {
                    failOnError: false
                }
            },
            user: {
                command: 'tsc -p user',
                options: {
                    failOnError: false
                }
            }
        },
        copy: {
            admin: {
                files: [
                    { expand: true, cwd: admin_root, src: ['**/*.html'], dest: admin_dest },
                    { expand: true, cwd: admin_root, src: ['data/*.json'], dest: admin_dest },
                    { expand: true, cwd: admin_root, src: ['**/*.js'], dest: admin_dest },
                    { expand: true, cwd: admin_root, src: ['**/*.css'], dest: admin_dest },
                    { expand: true, cwd: admin_root, src: ['fonts/**/*.*'], dest: admin_dest },
                    { expand: true, cwd: admin_root, src: ['assets/font/*.*'], dest: admin_dest },
                    { expand: true, cwd: admin_root, src: ['ueditor/**/*.*'], dest: admin_dest },
                ]
            },
            user: {
                files: [
                    { expand: true, cwd: user_root, src: ['**/*.html', '**/*.js', '**/*.css'], dest: user_dest },
                    { expand: true, cwd: `${admin_dest}/mobile`, src: ['**/control.*', '*.js'], dest: `${user_dest}/controls` },
                ]
            }
        },
        stylus: {
            admin: {
                options: {
                    compress: false,
                },
                files: [
                    {
                        expand: true,
                        cwd: admin_root + '/content',
                        src: ['**/*.styl'],
                        dest: admin_dest + '/content',
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: admin_root + '/modules',
                        src: ['**/*.styl'],
                        dest: admin_dest + '/modules',
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: admin_root + '/mobile',
                        src: ['**/*.styl'],
                        dest: admin_dest + '/mobile',
                        ext: '.css'
                    }
                ]
            },
            // bootstrap: {
            //     files: [{
            //         src: [admin_root + '/css/bootstrap-3.3.5/bootstrap.less'],
            //         dest: admin_dest + '/css/bootstrap.css'
            //     }]
            // },
            // chitu: {
            //     files: [{
            //         src: [admin_root + '/css/chitu.less'],
            //         dest: admin_dest + '/css/chitu.css'
            //     }]
            // }
        }
    });
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.registerTask('admin', ['shell:admin', 'copy:admin', 'stylus:admin']);
    grunt.registerTask('user', ['shell:user', 'copy:user']);
}