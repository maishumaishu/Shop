var admin_dest = 'www/admin';
var admin_src = 'admin';
var user_dest = 'www/user';
var user_src = 'user';
var dest = 'www';
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
                command: `tsc -p admin`,
                options: {
                    failOnError: false
                }
            },
            user: {
                command: `tsc -p user`,
                options: {
                    failOnError: false
                }
            }
        },
        copy: {
            admin: {
                files: [
                    { expand: true, cwd: admin_src, src: ['**/*.css', '**/*.html', 'content/font/*.*'], dest: admin_dest },
                    { expand: true, cwd: admin_src, src: ['lib/ueditor/**/*.*'], dest: admin_dest },
                    { expand: true, cwd: 'lib', src: ['*.js'], dest: `${admin_dest}/scripts` },
                    { expand: true, cwd: 'lib/dest', src: ['*.js'], dest: `${admin_dest}` },
                    { expand: true, cwd: `${user_src}/dest`, src: ['userServices.js'], dest: `${admin_dest}/mobile` }
                ]
            },
            admin_bt: {
                files: [
                    { expand: true, cwd: `${admin_src}/lib/bootstrap-3.3.7/fonts`, src: ['*.*'], dest: `${admin_dest}/content/font` },
                ]
            },
            user: {
                files: [
                    { expand: true, cwd: user_src, src: ['**/*.html', '**/*.css', '**/*.png', 'content/font/*.*'], dest: user_dest },
                    { expand: true, cwd: 'lib', src: ['*.js'], dest: `${user_dest}/scripts` },
                    { expand: true, cwd: `${user_src}/dest`, src: ['*.js'], dest: `${user_dest}` }
                ]
            }
        },
        less: {
            admin: {
                files: [
                    {
                        expand: true,
                        cwd: `${admin_src}`,
                        src: ['**/*.less'],
                        dest: `${admin_dest}`,
                        ext: '.css'
                    },
                ]
            },
            user: {
                options: {
                    sourceMap: true
                },
                files: [
                    {
                        expand: true,
                        cwd: user_src,
                        src: [`**/*.less`],
                        dest: `${user_dest}`,
                        ext: '.css',
                        filter: function (filepath) {
                            if (filepath.endsWith('style.less'))
                                return false;

                            return true;
                        }
                    }
                ]
            },
            mobileComponents: {
                files: [
                    {
                        expand: true,
                        cwd: `mobileComponents`,
                        src: ['**/*.less'],
                        dest: `mobileComponents/dest/mobileComponents`,
                        ext: '.css'
                    },
                ]
            },
            user_bt: {
                files: [
                    { expand: false, src: `${user_src}/content/bootstrap_red.less`, dest: `${user_dest}/content/bootstrap_red.css` }
                ]
            },
            admin_bt: {
                files: [
                    { expand: false, src: `${admin_src}/content/bootstrap_blue.less`, dest: `${admin_dest}/content/bootstrap_bule.css` }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('admin', ['shell:admin', 'sass:admin', 'less:admin', 'less:mobileComponents', 'stylus:admin', 'copy:admin']);
    grunt.registerTask('user', ['shell:user', 'less:user', 'copy:user']);
    grunt.registerTask('default', ['admin', 'user']);
    grunt.registerTask('admin_bt', ['less:admin_bt', 'copy:admin_bt']);
}

/**
 * 说明：
 * １.编译顺序 user/service user/pageComponents user admin
 */