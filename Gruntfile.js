var admin_dest = 'www';
var admin_src = 'src';
var user_dest = 'user_www';
var user_src = 'user';
var ts_options = {
    module: 'amd',
    target: 'es5',
    removeComments: true,
    // references: [
    //     admin_src + "/js/typings/*.d.ts"
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
                    { expand: true, cwd: admin_src, src: ['**/*.html'], dest: admin_dest },
                    { expand: true, cwd: admin_src, src: ['data/*.json'], dest: admin_dest },
                    { expand: true, cwd: admin_src, src: ['**/*.js'], dest: admin_dest },
                    { expand: true, cwd: admin_src, src: ['**/*.css'], dest: admin_dest },
                    { expand: true, cwd: admin_src, src: ['fonts/**/*.*'], dest: admin_dest },
                    { expand: true, cwd: admin_src, src: ['assets/font/*.*'], dest: admin_dest },
                    { expand: true, cwd: admin_src, src: ['scripts/ueditor/**/*.*'], dest: admin_dest },
                ]
            },
            user: {
                files: [
                    { expand: true, cwd: user_src, src: ['**/*.html', '**/*.js', '**/*.css'], dest: user_dest },
                    { expand: true, cwd: `${admin_dest}/mobile`, src: ['**/control.*', '*.js'], dest: `${user_dest}` },
                ]
            }
        },
        less: {

        },
        stylus: {
            admin: {
                options: {
                    compress: false,
                },
                files: [
                    {
                        expand: true,
                        cwd: admin_src + '/content',
                        src: ['**/*.styl'],
                        dest: admin_dest + '/content',
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: admin_src + '/modules',
                        src: ['**/*.styl'],
                        dest: admin_dest + '/modules',
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: admin_src + '/mobile',
                        src: ['**/*.styl'],
                        dest: admin_dest + '/mobile',
                        ext: '.css'
                    }
                ]
            }
            // bootstrap: {
            //     files: [{
            //         src: [admin_src + '/css/bootstrap-3.3.5/bootstrap.less'],
            //         dest: admin_dest + '/css/bootstrap.css'
            //     }]
            // },
            // chitu: {
            //     files: [{
            //         src: [admin_src + '/css/chitu.less'],
            //         dest: admin_dest + '/css/chitu.css'
            //     }]
            // }
        },
        less: {
            admin: {
                files: [
                    {
                        expand: true,
                        cwd: `${admin_src}/mobile/components`,
                        src: ['**/*.less'],
                        dest: `${admin_dest}/mobile/components`,
                        ext: '.css'
                    },
                    {
                        expand: false,
                        src: `${admin_src}/mobile/content/bootstrap-3.3.5/bootstrap.less`,
                        dest: `${admin_dest}/content/css/bootstrap.css`
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('admin', ['shell:admin', 'copy:admin', 'stylus:admin', 'less:admin']);
    grunt.registerTask('user', ['shell:user', 'copy:user']);
}