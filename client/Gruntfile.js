// var admin_src = 'client/admin';
// var user_src = 'client/user';
// var out = 'www';
// var lib = 'client/lib';

// var admin_dest = `${out}/admin`;
// var user_dest = `${out}/user`;

// var ts_options = {
//     module: 'amd',
//     target: 'es5',
//     removeComments: true,
//     sourceMap: false,
// };
var lib_es6_files = [
    `lib/chitu.js`, 'lib/chitu.mobile.js', `lib/wuzhui.js`, `lib/ui.js`, `lib/dilu.js`
];
var requirejs_paths = {

    css: 'lib/css',
    less: 'lib/require-less-0.1.5/less',
    lessc: 'lib/require-less-0.1.5/lessc',
    normalize: 'lib/require-less-0.1.5/normalize',
    text: 'lib/text',

    chitu: 'lib/chitu',
    dilu: 'lib/dilu',
    fetch: 'lib/fetch',
    react: 'lib/react.production',
    polyfill: 'lib/polyfill',
    ui: 'lib/ui',

    'less-builder': 'lib/require-less-0.1.5/less-builder',
    'react-dom': 'lib/react-dom.production',
    'prop-types': 'lib/prop-types',
    'template-web': 'lib/template-web',
    'url-search-params-polyfill': 'lib/url-search-params-polyfill',
    'iscroll-lite': 'lib/iscroll-lite'
};

let user_style = [
    'components/html/control.less',
    'components/navigator/control.less',
    'components/image/control.less',
    'components/productList/control.less'
];

// task names
let dev = 'dev', debug = 'debug', release = 'release';

var usages = `
grunt ${dev}
grunt ${debug}
grunt ${release}
`;

module.exports = function (grunt) {

    let custom_tasks = [dev, debug, release];
    let has_custom_task = grunt.cli.tasks.filter(o => custom_tasks.indexOf(o) >= 0).length >= 0;
    if (has_custom_task && grunt.cli.tasks.length > 1) {
        console.log(usages);
        return false;
    }
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
                    `admin/**/*.js`,
                    `components/**/*.js`,
                    `user/**/*.js`
                ]
            }
        },
        babel: {
            source: {
                options: {
                    sourceMap: false,
                    presets: ["es2015"],
                },
                files: [{
                    expand: true,
                    cwd: `./`,
                    src: [
                        `admin/**/*.js`, `components/**/*.js`, `user/**/*.js`,
                        `share/**/*.js`, ...lib_es6_files
                    ],
                    dest: `../out/es5`
                }]
            }
        },
        copy: {
            options: {
                noProcess: lib_es6_files
            },
            client: {
                files: [{
                    expand: true,
                    cwd: `./`,
                    src: [`lib/**/*`, ...lib_es6_files.map(o => `!${o}`),
                        'admin/index.html', 'user/index.html'
                    ],
                    dest: `../out/es5`
                }]
            },
            release: {
                files: [
                    {
                        expand: true,
                        cwd: `../out/es5`,
                        src: ['**/*'],
                        dest: `../www`
                    },
                    {
                        expand: true,
                        cwd: `./`,
                        src: ['**/*.less'],
                        dest: `../www`
                    }
                ]
            }
        },
        less: {
            dev: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: `./`,
                    src: ['components/style/*.less'],
                    // dest: `../out/es5`,
                    ext: '.css'
                }]
            },
            client: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: `./`,
                    src: ['components/style/*.less'],
                    dest: `../out/es5`,
                    ext: '.css'
                }]
            },
        },
        requirejs: {
            user: {
                options: {
                    baseUrl: `../out/es5`,
                    include: [
                        "polyfill", 'url-search-params-polyfill', 'fetch',
                        "css", "react", "react-dom", 'prop-types', 'ui',
                        "dilu", "user/application", 'template-web',
                        'iscroll-lite',
                        // ...user_style
                    ],
                    out: `../out/es5/user/build.js`,
                    optimize: 'uglify',
                    paths: Object.assign(requirejs_paths, {
                        site: 'user/site',
                        errorHandle: 'user/errorHandle',
                    }),
                    shim: {
                        dilu: {
                            exports: 'dilu'
                        },
                        ui: {
                            exports: 'ui'
                        }
                    }
                }
            },
            admin: {
                options: {
                    baseUrl: `../out/es5`,
                    include: [
                        "polyfill", 'url-search-params-polyfill', 'fetch',
                        "css", "react", "react-dom", 'prop-types', 'ui',
                        "dilu", 'share/common', 'share/service', 'template-web',
                        'admin/services/service', 'admin/application',
                    ],
                    out: `../out/es5/admin/build.js`,
                    optimize: 'uglify',
                    paths: Object.assign(requirejs_paths, {
                        masterPage: 'admin/masterPage'
                    }),
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
                    cwd: `../out/es5`,
                    src: [
                        '**/*.js',
                        '!components/**/*.js',
                        '!lib/**/*.js'
                    ],
                    dest: `www`
                }]
            }
        },
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask(dev, ['connect', 'watch']);
    grunt.registerTask(debug, [
        'copy:client',
        'babel',
        'less',
        'requirejs'
    ]);
    grunt.registerTask(release, [
        'debug',
        'copy:release',
        'uglify',
    ]);
}

///Volumes/data/projects/shop/out/es5/lib/polyfill.js