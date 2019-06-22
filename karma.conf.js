const webpackConfig = require('./webpack.config');
const env = (process.env.NODE_ENV || 'development');

module.exports = function (config) {
  config.set({
    basePath: '',
    files: [
      'src/engine/test/**/*.spec.ts'
    ],
    frameworks: ['jasmine'],
    
    exclude: [
      'node_modules',
    ],
    preprocessors: {
      'src/engine/test/**/*.ts': ['webpack']
    },
    // mime: { 
    //   'text/x-typescript': ['ts','tsx'],
    // },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: env !== 'development',
    concurrency: Infinity,
    webpack: {
      mode: 'development',
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
  });
};