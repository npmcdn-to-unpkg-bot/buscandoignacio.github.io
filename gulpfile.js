// Varbiables
var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    cssprefixer    = require('gulp-autoprefixer'),
    concat      = require('gulp-concat'),
    jshint      = require('gulp-jshint'),
    sass        = require('gulp-sass');  

var dest    = './_dist/',
    prod    = './_prod/',
    server  = 'http://centos.dev/sonic/buscandoignacio.github.io/';
      
var autoprefixer_browser = [
  'last 3 versions',
  'ie >= 8',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];
// - Browser Sync //
gulp.task('browser-sync', function(){
   browserSync.init({
       proxy: {
        target: server,
        middleware: function (req, res, next) {
            console.log(req.url);
            next();
        }
    },
   }); 
});
gulp.task('browser-sync-reload', function(){
   browserSync.reload();
});
// - CSS //
gulp.task('css', function(){
    return gulp.src( prod + 'scss/main.scss')
            .pipe( sass().on('error', sass.logError ))
            .pipe(cssprefixer( autoprefixer_browser ))
            .pipe(concat('main.css'))
            .pipe(gulp.dest( dest + 'css' ));
});
// - JS
gulp.task('js', function(){
    return gulp.src( prod + 'js/**/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(concat('main.js'))
            .pipe(gulp.dest(dest + 'js/'));
});
// - Watch
gulp.task('watch', ['browser-sync'], function(){
    gulp.watch( prod + 'scss/**/*', ['css'] );
    gulp.watch( prod + 'js/**/*.js', ['js','browser-sync-reload']);
});
// - Default
gulp.task('default',['css','js'] );

