module.exports = require('./webpack.config.js')({
  isProduction: false,
  devtool: 'cheap-eval-source-map',
  jsFileName: 'app.js',
  cssFileName: 'app.css',
  host: "0.0.0.0",
  port: 3000,
});
