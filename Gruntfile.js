var admin_dest = 'www/admin';
var admin_src = 'admin';
var user_dest = 'www/user';
var user_src = 'user';
var ts_options = {
    module: 'amd',
    target: 'es5',
    removeComments: true,
    sourceMap: false,
};
module.exports = function (grunt) {
    grunt.initConfig({
        shell: {
            admin: {
                command: `tsc -p ./`,
                options: {
                    failOnError: false
                }
            },
            user: {
                command: `tsc -p ./`,
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
                    { expand: true, cwd: 'scripts', src: ['*.js'], dest: `${admin_dest}/scripts` },
                    { expand: true, cwd: user_dest, src: ['userServices.js'], dest: `${admin_dest}/services` },
                ]
            },
            user: {
                files: [
                    { expand: true, cwd: user_src, src: ['**/*.html', '**/*.js', '**/*.css'], dest: user_dest },
                    { expand: true, cwd: `${admin_dest}/mobile`, src: ['**/control.*', '*.js'], dest: `${user_dest}` },
                    {
                        expand: true, cwd: user_src, dest: user_dest,
                        src: ['js/**/*.js', 'content/**/*.css', 'content/font/*.*', 'images/**/*.*', 'index.html'],
                    },
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
        },
        sass: {
            admin: {
                options: {
                    compress: false,
                },
                files: [
                    {
                        expand: true,
                        cwd: admin_src + '/content',
                        src: ['**/*.sass'],
                        dest: admin_dest + '/content',
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: admin_src + '/modules',
                        src: ['**/*.sass'],
                        dest: admin_dest + '/modules',
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: admin_src + '/mobile',
                        src: ['**/*.sass'],
                        dest: admin_dest + '/mobile',
                        ext: '.css'
                    }
                ]
            }
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
            },
            user: {
                files: [
                    {
                        expand: true,
                        cwd: user_src + `/modules`,
                        src: ['**/*.less'],
                        dest: `${user_src}/content/app`,
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: user_src,
                        src: [`*.less`],
                        dest: `${user_src}/content/app`,
                        ext: '.css'
                    },
                    { expand: false, src: `${user_src}/content/bootstrap-3.3.5/bootstrap.less`, dest: `${user_dest}/content/css/bootstrap.css` }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('admin', ['shell:admin', 'copy:admin', 'sass:admin', 'less:admin', 'stylus:admin']);
    grunt.registerTask('user', ['shell:user', 'less:user', 'copy:user']);
    grunt.registerTask('default', ['admin', 'user']);
}