const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const jspConfig = merge(baseConfig, {
  entry: {
    result: [
      './src/main/webapp/scripts/stage',
      './src/main/webapp/scripts/result-page',
      './src/main/webapp/styles/result.css'
    ]
  },
  output: {
    path: __dirname + '/../src/main/webapp/dist',
    filename: 'scripts/[name].js',
    publicPath: ''
  },
  plugins: [
    new ExtractTextPlugin("styles/[name].css")
  ]
})

module.exports = jspConfig