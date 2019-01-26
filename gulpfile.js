let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    bourbon = require('node-bourbon'),
    notify = require('gulp-notify'),
    babel = require('gulp-babel');

// Scripts
gulp.task('babel', function () {
    gulp.src([
      'app/js/main.js'
    ]).pipe(babel({presets: ['env']}))
      .pipe(concat('js2015.js'))
      .pipe(gulp.dest('app/js'))
  }
);

gulp.task('scripts', function () {
    return gulp.src([
        'app/js/js2015.js',
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        ghostMode: false
    });
});

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'babel', 'scripts', 'browser-sync'], function () {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/js/main.js', ['babel']);
    gulp.watch(['libs/**/*.js', 'app/js/js2015.js'], ['scripts']);
    gulp.watch('app/*.html', browserSync.reload);
});


gulp.task('default', ['watch']);
