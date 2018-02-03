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
        babel: {
            source: {
                options: {
                    sourceMap: false,
                    presets: ["es2015"],
                },
                files: [{
                    expand: true,
                    cwd: `out/es6`,
                    src: [`**/*.js`],
                    dest: `out/es5`
                }]
            }
        },
        copy: {
            lib_es6: {
                files: [{
                    expand: true,
                    cwd: `client/lib/es6`,
                    src: [`**/*.js`],
                    dest: `out/es6/scripts`
                }]
            },
            lib_es5: {
                files: [{
                    expand: true,
                    cwd: `client/lib`,
                    src: [`**/*.js`, '!es6/*'],
                    dest: `out/es5/scripts`
                }]
            },
            // 将生成的 es6 文件 copy 到 wwww
            es6_www: {
                files: [{
                    expand: true,
                    cwd: `out/es6/`,
                    src: `**/*.js`,
                    dest: `www`
                }]
            },
            // 将生成的 es5 文件 copy 到 wwww
            es5_www: {
                files: [{
                    expand: true,
                    cwd: `out/es5/`,
                    src: `**/*.js`,
                    dest: `www`
                },
                {
                    expand: true,
                    cwd: `out/es6/user`,
                    src: `boot.js`,
                    dest: `www/user`
                }
                ]
            },
            client: {
                files: [{
                    expand: true,
                    cwd: 'client',
                    src: [
                        'admin/*.html', 'admin/**/*.html', 'admin/**/*.css', 'admin/content/font/*',
                        'user/*.html', 'user/**/*.png', 'user/content/font/*', 'user/content/*.css',
                    ],
                    dest: 'www'
                }]
            }
        },
        shell: {
            client: {
                command: `tsc -p client`,
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
                    port: 2828,
                    // 服务器地址(可以使用主机名localhost，也能使用IP)
                    // hostname: '192.168.1.7',
                    hostname: '0.0.0.0',
                    // keepalive: true,
                    livereload: 20453,
                    // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
                    base: 'www',
                    open: false,
                    // protocol: 'https'
                }
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
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: `${admin_src}`,
                    src: ['**/*.less'],
                    dest: `${admin_dest}`,
                    ext: '.css'
                },]
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
                },]
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
                        css: '../scripts/css',
                        'chitu.mobile': '../scripts/chitu.mobile',
                        dilu: '../scripts/dilu',
                        react: '../scripts/react.production',
                        'react-dom': '../scripts/react-dom.production',
                        'prop-types': '../scripts/prop-types',
                        polyfill: '../scripts/polyfill',
                        // text: 'scripts/text',
                        // carousel: 'scripts/carousel',
                        // mobileComponents: 'pageComponents',
                        // mobileControls: 'scripts/mobileControls',
                        ui: '../scripts/ui',
                        'maishu-chitu': '../scripts/chitu',
                        'user': './',
                        'userServices': './services',
                        'share': '../share'
                    },
                    shim: {
                        dilu: {
                            exports: 'dilu'
                        },
                        ui: {
                            exports: 'ui'
                        }
                    }
                }
            }
        },
        uglify: {
            out: {
                options: {
                    mangle: false
                },
                files: [{
                    expand: true,
                    cwd: `out/es5`,
                    src: [
                        'user/services/*.js', 'user/mobileComponents/*.js', 'user/mobileComponents/**/*.js',
                        'admin/services/*.js', 'admin/*.js'
                    ],
                    dest: `www`
                }]
     }
        },
        watch: {
            livereload: {
                options: {
                    livereload: 20453 //监听前面声明的端口  35729
                },
                files: [
                    `out/es6/**/*`
                ]
            }
        }
    });

    //===============================================================
    grunt.event.on('watch', function (action, filepath, target) {
        grunt.log.writeln(`action:${action}\n`);
        grunt.log.writeln(`filepath:${filepath}\n`);
        grunt.log.writeln(`target:${target}\n`);

        let arr = filepath.split(/\/|\\/);
        arr.shift();
        arr[0] = 'www';
        let target_pathname = arr.join('/');//filepath.replace('out\es6', 'www');
        grunt.log.writeln(`target_pathname:${target_pathname}\n`);

        grunt.file.copy(filepath, `${target_pathname}`);

    });
    //===============================================================

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('admin', ['less:admin', 'less:mobileComponents', 'copy:admin']);

    grunt.registerTask('build-es6', ['shell', 'copy:lib_es6']);
    grunt.registerTask('build-es5', ['shell', 'copy:lib_es5', 'copy:lib_es6', 'babel']);
    grunt.registerTask('run', ['connect', 'watch']);

    grunt.registerTask('release', ['build-es5', 'copy:es5_www', 'uglify', 'requirejs']);
    grunt.registerTask('dev', ['build-es6', 'copy:es6_www', 'connect', 'watch']);
}

/**
 * 说明：
 * lib/src/ui lib/src/mobileControls lib/src
 * １.编译顺序 user/service user/pageComponents user admin
 */