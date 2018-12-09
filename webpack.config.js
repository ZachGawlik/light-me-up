const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const baseWebpack = {
  entry: './client/index.js',
  mode: process.env.NODE_ENV,
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      hash: true,
      template: './client/index.html',
    }),
  ],
}

if (process.env.NODE_ENV === 'development') {
  baseWebpack.devServer = {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8001,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  }
}

module.exports = baseWebpack
