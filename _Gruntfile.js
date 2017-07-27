var stylelintConfig = {
    "rules": {
        "block-no-empty": true,
        "color-no-invalid-hex": true,
        "declaration-colon-space-after": "always",
        "declaration-colon-space-before": "never",
        "function-comma-space-after": "always",
        "media-feature-colon-space-after": "always",
        "media-feature-colon-space-before": "never",
        "media-feature-name-no-vendor-prefix": true,
        "max-empty-lines": 5,
        "max-nesting-depth": [3, {
            "ignore": ["blockless-at-rules"],
            "ignoreAtRules": ["include", "for", "each"]
        }],
        "number-leading-zero": "never",
        "number-no-trailing-zeros": true,
        "property-no-vendor-prefix": true,
        "declaration-block-no-duplicate-properties": true,
        "declaration-block-trailing-semicolon": "always",
        "selector-list-comma-space-before": "never",
        "selector-list-comma-newline-after": "always",
        "selector-no-id": true,
        "string-quotes": "double",
        "value-no-vendor-prefix": true
    }
};

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        app: {
            dirs: {
                tmp: '.tmp',
                src: 'frontend',
                js: '<%= app.dirs.src %>/js',
                scss: '<%= app.dirs.src %>/scss',
                img: '<%= app.dirs.src %>/images',
                fonts: '<%= app.dirs.src %>/fonts',
                data: '<%= app.dirs.js %>/data',
                compiled: 'compiled',
            }
        },

        clean: {
            build: {
                src: ["compiled"]
            },
            data: {
                src: ["<%= app.dirs.assemble %>/data/context"]
            },
            js: {
                src: ['<%= app.dirs.compiled %>/js/*.js', '!<%= app.dirs.compiled %>/js/all.min.js']
            },
            scss: {
                src: ["<%= app.dirs.compiled %>/scss"]
            }
        },

        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dirs.fonts %>',
                    src: ['**/*'],
                    dest: 'compiled/fonts'
                }, {
                    expand: true,
                    cwd: '<%= app.dirs.js %>',
                    src: ['**/*'],
                    dest: 'compiled/js'
                },]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dirs.js %>',
                    src: ['**/*'],
                    dest: 'compiled/js'
                }, ]
            },
            data: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dirs.data %>',
                    src: ['**/*'],
                    dest: 'compiled/js/data'
                }]
            },
            img: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dirs.src %>/images',
                    src: ['**/*'],
                    dest: 'compiled/images'
                }]
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dirs.fonts %>',
                    src: ['**/*'],
                    dest: 'compiled/fonts'
                }, {
                    expand: true,
                    cwd: '<%= app.dirs.data %>',
                    src: ['**/*'],
                    dest: 'compiled/js/data'
                },]
            },
        },


        sass_directory_import: {
            files: {
                src: ['<%= app.dirs.scss %>/**/_all.scss']
            },
        },

        sass: {
            options: {
                outputStyle: 'expanded',
                sourceMap: true,
                includePaths: ['bower_components/breakpoint-sass/stylesheets']
            },
            dist: {
                files: {
                    'compiled/css/core.css': '<%= app.dirs.scss %>/core.scss'
                }
            }
        },

        postcss: {
            before: {
                options: {
                    processors: [
                        require('stylelint')(stylelintConfig),
                        require('postcss-reporter')({
                            clearMessages: true,
                            throwError: true
                        })
                    ],
                    syntax: require('postcss-scss'),
                    writeDest: false
                },
                src: ['<%= app.dirs.scss %>/**/*.scss','!<%= app.dirs.scss %>/_bower.scss','!<%= app.dirs.scss %>/_sprite.scss', '!<%= app.dirs.scss %>/_sprite-2x.scss', '!<%= app.dirs.scss %>/font-awesome/**/*.scss']
            },
            after: {
                options: {
                    map: true,
                    processors: [
                        require('lost')(),
                        require('autoprefixer')({
                            browsers: [
                                "Android 2.3",
                                "Android >= 4",
                                "Chrome >= 20",
                                "Firefox >= 24",
                                "Explorer >= 8",
                                "iOS >= 6",
                                "Opera >= 12",
                                "Safari >= 6"
                            ]
                        }),
                    ]
                },
                src: ['<%= app.dirs.compiled %>/css/*.css','!<%= app.dirs.compiled %>/css/*.css.map']
            }
        },

        watch: {
            options: {
                spawn: false
            },
            gruntfile: {
                files: 'Gruntfile.js',
                options: {
                    reload: true
                }
            },

            html: {
                files: ['<%= app.dirs.src %>/**/*.md', '<%= app.dirs.src %>/**/*.html'],
                tasks: ['jekyll'],
            },

            image: {
                files: ['<%= app.dirs.img %>/**/*.{png,jpg,gif}'],
                tasks: ['newer:copy:img'],
            },

            sprite: {
                files: ['<%= app.dirs.img %>/sprite/*.png', '<%= app.dirs.img %>/sprite-2x/*.png'],
                tasks: ['sprite', 'newer:imagemin']
            },

            svg: {
                files: ['<%= app.dirs.img %>/svg/*.svg'],
                tasks: ['imagemin:svg', 'grunticon']
            },

            sassDirImport: {
                files: ['<%= app.dirs.scss %>/**/*.scss'],
                tasks: ['sass_directory_import'],
                options: {
                    event: ['added', 'deleted']
                }
            },
                

            sass: {
                files: ['<%= app.dirs.scss %>/**/*.scss'],
                tasks: ['postcss:before', 'sass', 'postcss:after'],
                options: {
                    debounceDelay: 1000,
                    event: ['changed']
                }
            },

            js: {
                files: ['<%= app.dirs.js %>/**/*.js'],
                tasks: ['newer:jshint:dev', 'newer:copy:js'],
            },
            // jshint: {
            //     files: ['<%= app.dirs.js %>/*.js'],
            //     tasks: ['newer:jshint:dev'],
            //     options: {
            //         event: ['changed']
            //     }
            // },
            data: {
                files: ['<%= app.dirs.data %>/**/*.json'],
                tasks: ['newer:jsonlint', 'newer:copy:data'],
            },
            bower: {
                // Watch for additions to bower.json then run bower_concat
                files: 'bower.json',
                tasks: ['bower_concat'],
                options: {
                    event: ['changed']
                }
            }
        },

        jekyll: {                             // Task
            options: {                          // Universal options
              bundleExec: true,
              src : '<%= app.dirs.src %>'
            },
            dist: {                             // Target
              options: {                        // Target options
                dest: '<%= app.dirs.compiled %>',
                config: '_config.yml'
              }
            }
        },

        bower_concat: {
            all: {
                dest: {
                    js: 'frontend/js/bower.js',
                    scss: '<%= app.dirs.scss %>/_bower.scss',
                    css: '<%= app.dirs.scss %>/_bower.scss'
                },
                exclude: [
                    'breakpoint-sass',
                    'sassy-maps'
                ],
                dependencies: {
                    'jquery.customSelect': 'jquery',
                    'velocity': 'jquery'
                },
                bowerOptions: {
                    // relative: false
                },
                mainFiles: {
                  /*  'pickadate': [
                        "lib/picker.js",
                        "lib/picker.date.js",
                        "lib/picker.time.js",
                        "lib/themes/classic.css",
                        "lib/themes/classic.date.css",
                        "lib/themes/classic.time.css"
                    ],*/
                    'retina.js': 'dist/retina.js',
                   /* 'fancybox': [
                        "source/jquery.fancybox.pack.js",
                        "source/jquery.fancybox.js",
                        "source/helpers/jquery.fancybox-media.js",
                        "source/jquery.fancybox.css"
                    ]*/
                }
            }
        },

        jshint: {
            options: {
                '-W097': true,
                'devel': true,
                'predef': ['angular']
            },
            dev: ['Gruntfile.js', '<%= app.dirs.js %>/ui.js', '<%= app.dirs.js %>/ng-scripts.js']
        },

        jsonlint: {
            dev: {
                src: ['<%= app.dirs.src %>/dummy-data/**/*.json']
            }
        },

        removelogging: {
            dist: {
                src: "<%= app.dirs.js %>/ui.js",
                dest: "<%= app.dirs.compiled %>/js/ui.js",
                options: {
                    // see below for options. this is optional. 
                }
            }
        },

        concat: {
            options: {
                // separator: ';',
                sourceMap: true
            },
            all: {
                src: [
                    '<%= app.dirs.src %>/js/bower.js',
                    '<%= app.dirs.src %>/js/ui.js'
                ],
                dest: '<%= app.dirs.src %>/js/all.js',
            }
        },


        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'compiled/js/all.min.js': ['frontend/js/all.js']
                }
            }
        },


        sprite: {
            core: {
                src: '<%= app.dirs.img %>/sprite/*.png',
                dest: '<%= app.dirs.img %>/sprite.png',
                destCss: '<%= app.dirs.scss %>/_sprite.scss',
                algorithm: 'top-down',
                padding: 0
            },

            retina: {
                src: '<%= app.dirs.img %>/sprite-2x/*.png',
                dest: '<%= app.dirs.img %>/sprite-2x.png',
                destCss: '<%= app.dirs.scss %>/_sprite-2x.scss',
                algorithm: 'top-down',
                padding: 0
            }
        },

        grunticon: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dirs.img %>/svg/stripped',
                    src: ['*.svg'],
                    dest: "compiled/images/svg/output"
                }],
                options: {
                    // Handle your options as you normally would here
                    enhanceSVG: true,
                    embedIcons: true,
                    previewTemplate: '<%= app.dirs.src %>/images/svg/icons-preview.hbs',
                    template: '<%= app.dirs.src %>/images/svg/custom-css.hbs'
                }
            }
        },

        imagemin: {
            img: {
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: '<%= app.dirs.img %>/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'compiled/images/' // Destination path prefix
                }]
            },
            svg: {
                options: {
                    svgoPlugins: [{ 
                        removeViewBox: false 
                    }]
                },
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: '<%= app.dirs.img %>/svg/', // Src matches are relative to this path
                    src: ['*.svg'], // Actual patterns to match
                    dest: '<%= app.dirs.img %>/svg/stripped/' // Destination path prefix
                }]
            },
        },
        modernizr: {
            dist: {
                "crawl": true,
                "customTests": [],
                "dest": "<%= app.dirs.compiled %>/js/lib/modernizr-output.js",
                "tests": [
                    
                ],
                "options": [
                    "html5shiv",
                    "setClasses"
                ],
                "files" : {
                    "src": [
                        "<%= app.dirs.scss %>/**/*.scss",
                        "!lib/**/*"
                    ]
                },
                "uglify": true
            }  
        },
        /*BrowserSync task below sets up a simple hhtp server and auto refresh/insert. It also has some very cool features with accessing on LAN*/
        browserSync: {
            dev: {
                bsFiles: {
                    src: ["compiled/*.html", "compiled/pages/*.html", "compiled/widgets/*.html", "compiled/components/*.html", "compiled/css/**/*.css", "compiled/js/**/*.js", "compiled/images/**/.{jpg,png,gif}"],
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "compiled"
                    }
                }
            },
            build: {
                options: {
                    watchTask: false,
                    server: {
                        baseDir: "compiled"
                    }
                }
            }
        }

    });

    /*Frontend*/
    grunt.registerTask('default', ['clean:data', 'jekyll', 'jshint:dev', 'jsonlint', 'bower_concat', 'clean:scss', 'concat', 'uglify', 'copy:dev', 'sprite', 'imagemin:svg',  'grunticon', 'newer:copy:img', 'sass_directory_import', 'postcss:before', 'sass', 'postcss:after', 'modernizr', 'clean:js', 'browserSync:dev', 'watch']);

    /*Backend*/
   // grunt.registerTask('beBuild', ['clean:data', 'clean:build', 'jshint:dev', 'jsonlint', 'copy:prod', 'bower_concat', 'removelogging', 'concat', 'uglify', 'clean:js', 'assemble', 'sprite', 'imagemin:svg', 'grunticon', 'newer:imagemin:img', 'sass_directory_import', 'postcss:before', 'sass', 'postcss:after', 'modernizr', 'browserSync:build']);

    // grunt.registerTask('beEdit', ['clean:data', 'jshint:dev', 'jsonlint', 'copy:dev', 'bower_concat', 'uglify', 'assemble', 'sprite', 'imagemin:svg', 'grunticon', 'newer:imagemin:img', 'sass_directory_import', 'postcss:before', 'sass', 'postcss:after', 'modernizr', 'browserSync:dev', 'watch']);
    // To do - backend production build task
};
