const path = require('path');

const getWebpackConfig = ({ directory }) => ({
  mode: 'development',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: 'babel-loader',
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(directory, 'lib'),
  },
  resolve: {
    alias: {
      '@src': path.resolve(directory, 'src'),
      '@test': path.resolve(directory, 'test'),
    },
    extensions: ['.ts', '.mjs', '.js'],
  },
  target: 'node',
});

module.exports = getWebpackConfig;
