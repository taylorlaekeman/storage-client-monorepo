const path = require('path');

module.exports = {
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
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@test': path.resolve(__dirname, 'test'),
    },
    extensions: ['.ts', '.mjs', '.js'],
  },
  target: 'node',
};
