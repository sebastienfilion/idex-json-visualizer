var es = require('event-stream'),
  gulp = require('gulp'),
  templateCache = require('gulp-angular-templatecache'),
  concat = require('gulp-concat'),
  debug = require('gulp-debug'),
  flatten = require('gulp-flatten'),
  uglify = require('gulp-uglify'),
  order = require('gulp-order'),
  path = require('path'),
  runSequence = require('run-sequence'),
  args = require('yargs').argv,

  SOURCE_DIRECTORY = 'idex-json-visualizer',
  TARGET_DIRECTORY = '.';

gulp.task('build:app', function () {
  var application = assembleApplication();

  return application
    .pipe(concat('idex-json-visualizer.js'))
    .pipe(gulp.dest(TARGET_DIRECTORY));
});

gulp.task('build:app+minified', function () {
  var application = assembleApplication();

  return application
    .pipe(uglify())
    .pipe(concat('idex-json-visualizer.min.js'))
    .pipe(gulp.dest(TARGET_DIRECTORY));
});

gulp.task('build:app+minified+vendors', function () {
  var application = assembleApplication(),
    vendors = gulp.src([
      path.join(SOURCE_DIRECTORY, 'vendors/angular/angular.min.js'),
      path.join(SOURCE_DIRECTORY, 'vendors/angular-sanitize/angular-sanitize.min.js')
    ]);

  application = application
    .pipe(uglify());

  return es.concat([application, vendors])
    .pipe(order([
      path.join(SOURCE_DIRECTORY, 'vendors/angular/angular.min.js'),
      path.join(SOURCE_DIRECTORY, 'vendors', '**', '*.js')
    ]))
    .pipe(concat('idex-json-visualizer.vendor.min.js'))
    .pipe(gulp.dest(TARGET_DIRECTORY));
});

gulp.task('build', function (callback) {

  if (!!args.watch) runSequence('build:app', 'watch', callback);
  else if (!!args.bower) runSequence('build:app', 'build:app+minified', 'build:app+minified+vendors', callback);
  else runSequence('build:app', callback);
});

gulp.task('watch', function() {
  gulp.watch([
    path.join(SOURCE_DIRECTORY, 'application.js'),
    path.join(SOURCE_DIRECTORY, '**', '*.js'),
    '!' + (path.join(SOURCE_DIRECTORY, 'vendors')),
    '!' + (path.join(SOURCE_DIRECTORY, '**', '*.specs.js')),
    path.join(SOURCE_DIRECTORY, '**', '*.html')
  ], ['build:app']);

  console.log("Watching...\n");
});


function assembleApplication () {
  var scripts, templates, vendors, application;

  scripts = gulp.src([
    path.join(SOURCE_DIRECTORY, 'application.js'),
    path.join(SOURCE_DIRECTORY, '**', '*.js'),
    '!' + path.join(SOURCE_DIRECTORY, '**', '*.specs.js'),
    '!' + path.join(SOURCE_DIRECTORY, 'vendors', '**', '*.js')
  ]);

  templates = gulp.src(path.join(SOURCE_DIRECTORY, '**', '*.html'))
    .pipe(templateCache('template.js', {
      module: 'idex-json-visualizer'
    }));

  application = es.concat([scripts, templates])
    .pipe(flatten())
    .pipe(order([
      path.join(SOURCE_DIRECTORY, 'application.js'),
      path.join(SOURCE_DIRECTORY, '**', '*.js'),
      path.join(SOURCE_DIRECTORY, 'template.js')
    ]));

  return application;
}