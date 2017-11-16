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
        shell: {
            admin: {
                command: `tsc -p ${admin_src}`,
                options: {
                    failOnError: false
                }
            },
            user: {
                command: `tsc -p ${user_src}`,
                options: {
                    failOnError: false
                }
            }
        },
        // 通过connect任务，创建一个静态服务器
        connect: {
            www: {
                options: {
                    // 服务器端口号
                    port: 2626,
                    // 服务器地址(可以使用主机名localhost，也能使用IP)
                    hostname: '192.168.1.7',
                    // hostname: '127.0.0.1',
                    keepalive: true,
                    livereload: 20453,
                    // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
                    base: 'www',
                    open: true,
                    // protocol: 'https'
                }
            }
        },
        copy: {
            admin: {
                files: [{
                        expand: true,
                        cwd: admin_src,
                        src: ['**/*.css', '**/*.html', 'content/font/*.*'],
                        dest: admin_dest
                    },
                    {
                        expand: true,
                        cwd: `${lib}`,
                        src: ['ueditor/**/*.*'],
                        dest: `${admin_dest}/scripts`
                    },
                    {
                        expand: true,
                        cwd: `${lib}`,
                        src: ['umeditor/**/*.*'],
                        dest: `${admin_dest}/scripts`
                    },
                    {
                        expand: true,
                        cwd: `${lib}`,
                        src: ['*.js'],
                        dest: `${admin_dest}/scripts`
                    },
                    {
                        expand: true,
                        cwd: `${admin_src}/lib/bootstrap-3.3.7/fonts`,
                        src: ['*.*'],
                        dest: `${admin_dest}/content/font`
                    },
                    // { expand: true, cwd: 'lib/dest', src: ['*.js'], dest: `${admin_dest}` },
                    // { expand: true, cwd: `${user_src}/dest`, src: ['userServices.js'], dest: `${admin_dest}/mobile` }
                ]
            },
            user: {
                files: [{
                        expand: true,
                        cwd: user_src,
                        src: ['**/*.html', '**/*.css', '**/*.png', 'content/font/*.*'],
                        dest: user_dest
                    },
                    {
                        expand: true,
                        cwd: lib,
                        src: ['*.js'],
                        dest: `${user_dest}/scripts`
                    },
                    {
                        expand: true,
                        cwd: user_src,
                        src: ['*.js'],
                        dest: user_dest
                    }
                ]
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: [{
                    expand: true,
                    cwd: `${out}`,
                    src: ['**/*.css'],
                    dest: 'www'
                }]
            }
        },
        less: {
            admin: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: `${admin_src}`,
                    src: ['**/*.less'],
                    dest: `${admin_dest}`,
                    ext: '.css'
                }, ]
            },
            user: {
                options: {
                    sourceMap: true
                },
                files: [{
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
                }]
            },
            mobileComponents: {
                files: [{
                    expand: true,
                    cwd: `mobileComponents`,
                    src: ['**/*.less'],
                    dest: `mobileComponents/dest/mobileComponents`,
                    ext: '.css'
                }, ]
            }
        },
        requirejs: {
            user: {
                options: {
                    baseUrl: `${out}/user`,
                    include: [
                        "polyfill",
                        "css", "react", "react-dom", 'prop-types', 'ui',
                        "dilu",
                        'site', 'errorHandle',
                        'mobileComponents/common',
                        'modules/home/index'
                    ],
                    out: `www/user/build.js`,
                    optimize: 'uglify', //'none',//
                    paths: {
                        css: 'scripts/css',
                        'chitu.mobile': 'scripts/chitu.mobile',
                        dilu: 'scripts/dilu',
                        react: 'scripts/react.production',
                        'react-dom': 'scripts/react-dom.production',
                        'prop-types': 'scripts/prop-types',
                        polyfill: 'scripts/polyfill',
                        // text: 'scripts/text',
                        // carousel: 'scripts/carousel',
                        // mobileComponents: 'pageComponents',
                        // mobileControls: 'scripts/mobileControls',
                        ui: 'scripts/ui',
                        'maishu-chitu': 'scripts/chitu',
                        'user': './',
                        'userServices': './services'
                    },
                    shim:{
                        dilu: {
                            exports: 'dilu'
                        },
                        ui:{
                            exports: 'ui'
                        }
                    }
                }
            }
        },
        uglify: {
            out: {
                files: [{
                    expand: true,
                    cwd: `${out}`,
                    src: '**/*.js',
                    dest: `www`
                }]
            }
        },
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.registerTask('admin', ['less:admin', 'less:mobileComponents', 'copy:admin']);
    grunt.registerTask('user', ['less:user', 'copy:user']);
    grunt.registerTask('default', ['admin', 'user']);
    grunt.registerTask('admin_bt', ['less:admin_bt', 'copy:admin_bt']);
}

/**
 * 说明：
 * lib/src/ui lib/src/mobileControls lib/src
 * １.编译顺序 user/service user/pageComponents user admin
 */