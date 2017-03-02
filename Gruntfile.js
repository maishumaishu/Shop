var dest_root = 'www';
var src_root = 'src';
var ts_options = {
    module: 'amd',
    target: 'es5',
    removeComments: true,
    // references: [
    //     src_root + "/js/typings/*.d.ts"
    // ],
    sourceMap: false,
};
module.exports = function (grunt) {
    grunt.initConfig({
        shell: {
            ts_user: {
                command: 'tsc -p src',
                options: {
                    failOnError: false
                }
            },
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: src_root, src: ['**/*.html'], dest: dest_root },
                    { expand: true, cwd: src_root, src: ['**/*.json'], dest: dest_root },
                    { expand: true, cwd: src_root, src: ['**/*.js'], dest: dest_root },
                    { expand: true, cwd: src_root, src: ['**/*.css'], dest: dest_root },
                    { expand: true, cwd: src_root, src: ['fonts/**/*.*'], dest: dest_root },
                    { expand: true, cwd: src_root, src: ['assets/font/*.*'], dest: dest_root },
                    { expand: true, cwd: src_root, src: ['ueditor/**/*.*'], dest: dest_root },
                ]
            }
        },
        stylus: {
            app: {
                options: {
                    compress: false,
                },
                files: [
                    {
                        expand: true,
                        cwd: src_root + '/content',
                        src: ['**/*.styl'],
                        dest: dest_root + '/content',
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: src_root + '/modules',
                        src: ['**/*.styl'],
                        dest: dest_root + '/modules',
                        ext: '.css'
                    },
                     {
                        expand: true,
                        cwd: src_root + '/mobile',
                        src: ['**/*.styl'],
                        dest: dest_root + '/mobile',
                        ext: '.css'
                    }
                ]
            },
            // bootstrap: {
            //     files: [{
            //         src: [src_root + '/css/bootstrap-3.3.5/bootstrap.less'],
            //         dest: dest_root + '/css/bootstrap.css'
            //     }]
            // },
            // chitu: {
            //     files: [{
            //         src: [src_root + '/css/chitu.less'],
            //         dest: dest_root + '/css/chitu.css'
            //     }]
            // }
        }
    });
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.registerTask('default', ['shell', 'copy', 'stylus']);
}