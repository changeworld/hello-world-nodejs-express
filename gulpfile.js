var gulp = require('gulp');
var mocha = require('gulp-mocha');
var zip = require('gulp-zip');
var minimist = require('minimist');
var path = require('path');
var fs = require('fs');

var knownOptions = {
  string: 'packageName',
  string: 'packagePath',
  default: {packageName: "package.zip", packagePath: path.join(__dirname, '_package')}
}

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('test', function() {
  return gulp.src('./test/**/*.js')
    .pipe(mocha({reporter: 'mocha-junit-reporter'}));
});

gulp.task('package', function () {
  var packagePaths = [
    '**',
    '!**/_package/**',
    '!**/typings/**',
    '!typings',
    '!_package', 
    '!gulpfile.js'
  ]

  var packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  var devDeps = packageJSON.devDependencies;

  for(var propName in devDeps) {
    var excludePattern1 = "!**/node_modules/" + propName + "/**";
    var excludePattern2 = "!**/node_modules/" + propName;
    packagePaths.push(excludePattern1);
    packagePaths.push(excludePattern2);
  }
  return gulp.src(packagePaths)
    .pipe(zip(options.packageName))
    .pipe(gulp.dest(options.packagePath));
})

gulp.task('default', ['test', 'package']);
