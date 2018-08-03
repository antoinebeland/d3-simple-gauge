const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');

/**
 * Dist Task
 * ---------
 * Creates dist version of the script.
 */
gulp.task('dist', cb => {
  pump([
      gulp.src('./src/*.js'),
      babel({
        presets: ['env']
      }),
      uglify(),
      gulp.dest('dist')
    ],
    cb
  );
});

/**
 * Default Task
 * ------------
 * Creates a watcher to watch file changes.
 */
gulp.task('default', ['dist'], () => {
  gulp.watch('./src/*.js', ['dist'])
    .on('change', (event) => {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
