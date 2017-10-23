const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const regularConfig = merge(baseConfig, {
  entry: {
    app: './src/main/webapp/main',
  },
  output: {
    path: __dirname + '/../src/main/webapp/dist',
    filename: 'scripts/[name].[hash:7].js',
    publicPath: ''
  },
  plugins: [
    new CopyWebpackPlugin(
      [
        { from: 'META-INF', to: 'META-INF' },
        { from: 'WEB-INF', to: 'WEB-INF' },
        { from: 'images', to: 'images' },
        { from: 'result.jsp' }
      ],
      {
        context: './src/main/webapp',
        copyUnmodified: true
      }
    ),

    new HtmlWebpackPlugin({
      template: 'src/main/webapp/index.html',
      filename: 'index.html',
      chunks: ['app'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
      }
    }),

    new ExtractTextPlugin("styles/[name].[contenthash:7].css")
  ]
})

module.exports = regularConfig