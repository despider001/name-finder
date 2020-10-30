const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: { app: path.join(__dirname, 'app') },
  resolve: { extensions: ['.js', '.ts'] },
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  // this makes sure we include node_modules and other 3rd party libraries
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  node: {
    __dirname: true
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  }
};
