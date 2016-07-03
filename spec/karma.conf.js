module.exports = function(karma) {
  karma.set({
    basePath: '../',
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'mocha', 'chai-sinon'],
    files: ['spec/**/*_spec.js'],
    preprocessors: {
      'spec/**/*_spec.js': [ 'browserify' ]
    },

    browserify: {
      configure: function browserify(bundle) {
        bundle.once('prebundle', function prebundle() {
          bundle.transform('babelify', {presets: ['es2015']});
        });
      }
    },
    reporters: ['mocha']
  })
}
