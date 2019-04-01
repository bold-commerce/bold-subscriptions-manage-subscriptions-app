const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: ['idempotent-babel-polyfill', './src/index.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader",
          options: {
            sourceMap: true
          }
        }, {
          loader: "sass-loader",
          options: {
            sourceMap: true
          }
        }]
      },
      {
          test: /\.css$/,
          include: /node_modules/,
          use: [{
              loader: "style-loader"
          }, {
              loader: "css-loader",
              options: {
                  sourceMap: true
              }
          }]
      }
    ]
  }
};
