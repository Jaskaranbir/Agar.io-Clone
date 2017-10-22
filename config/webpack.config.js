const webpack = require('webpack')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  entry: {
    app: './src/main/webapp/main'
  },
  output: {
    path: __dirname + '/../src/main/webapp/dist',
    filename: 'scripts/[name].[hash].js',
    publicPath: ''
  },

  module: {
    loaders: [
      {
        // For injecting generated hashed image names into HTML
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                config: 'config/postcss.config.js'
              }
            }
          ],
          publicPath: 'styles'
        })
      },
      {
        test: /\.(woff2?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=fonts/[name].[hash:7].[ext]"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader?name=images/[name].[hash:7].[ext]'
      }
    ].concat(
        generateExportLoaders([
        { name: 'Stage', file: 'stage.js' },
        { name: ['elements', 'mouse', 'controls', 'entities'], file: 'global.js' },
        { name: 'Enemies', file: 'enemies.js' },
        { name: 'ChatHandler', file: 'chat.js'},
        { name: 'Foods', file: 'foods.js'},
        { name: 'Socket', file: 'websocket.js'},
        { name: 'Player', file: 'player.js'},
        { name: 'PerfMonitor', file: 'perf-monitor.js'},
        { name: 'GameLoop', file: 'gameloop.js'},
        { name: 'Leaderboard', file: 'leaderboard.js'}
      ])
    )
  },

  stats: {
    colors: true
  },

  plugins: [
    new WebpackCleanupPlugin(),

    new ExtractTextPlugin("styles/[name].[contenthash].css"),

    new OptimizeCSSPlugin(),

    new CopyWebpackPlugin(
      [
        { from: 'META-INF', to: 'META-INF' },
        { from: 'WEB-INF', to: 'WEB-INF' },
        { from: 'images', to: 'images' },
        { from: 'styles/result.css', to: 'styles/result.css' },
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
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
      }
    }),

    new webpack.ProvidePlugin(generateProviders([
      {name: 'controls', file: './global.js'},
      {name: 'elements', file: './global.js'},
      {name: 'mouse', file: './global.js'},
      {name: 'entities', file: './global.js'},
      {name: 'Stage', file: './stage.js'},
      {name: 'Player', file: './player.js'},
      {name: 'Socket', file: './websocket.js'},
      {name: 'Enemies', file: './enemies.js'},
      {name: 'ChatHandler', file: './chat.js'},
      {name: 'GameLoop', file: './gameloop.js'},
      {name: 'Foods', file: './foods.js'},
      {name: 'PerfMonitor', file: './perf-monitor.js'},
      {name: 'Leaderboard', file: './leaderboard.js'}
    ])),

    new webpack
      .optimize
      .UglifyJsPlugin({
        compress: {
          unused: false
        },
        comments: false
      })
  ]
}

module.exports = config

function generateProviders(dependencies) {
  return dependencies.reduce((outObj, depen) => {
    outObj[depen.name] = [depen.file, depen.name]
    return outObj
  }, {})
}

function generateExportLoaders(dependencies) {
  return dependencies.reduce((outObj, depen) => {
    // Convert string to array, leave array as is
    const nameArr = [].concat(depen.name)
    const depenStr = nameArr.reduce((outStr, e) => (outStr += `${e}=${e},`), '').slice(0, -1) // Removing last comma

    outObj.push({
      test: require.resolve(`../src/main/webapp/scripts/${depen.file}`),
      loader: `exports-loader?${depenStr}`
    })
    return outObj
  }, [])
}