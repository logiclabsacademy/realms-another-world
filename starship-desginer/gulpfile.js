const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
    styles: {
        src: 'src/scss/**/*.scss',
        dest: 'dist/css'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'dist/js'
    }
};

// Compile SCSS into CSS
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'style',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// Minify JavaScript
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Watch files
function watchFiles() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch('*.html').on('change', browserSync.reload);
}

// Define complex tasks
const build = gulp.series(gulp.parallel(styles, scripts));
const watch = gulp.series(build, watchFiles);

// Export tasks
exports.styles = styles;
exports.scripts = scripts;
exports.build = build;
exports.watch = watch;
exports.default = watch;
