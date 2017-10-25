const path = require('path'),
      webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin');

/*
  Are we in production mode? We also include staging (or any other non-
  development environment) as prod-like for webpack purposes, but pass
  the actual environment to the config file.
*/
const NODE_ENV = process.env.NODE_ENV || 'development';
const prodLike = (NODE_ENV !== 'development');

// Actual config object
let config = {
  entry: {
    app: './src/main.tsx'
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: 'js/[name]-[chunkhash].js',
    chunkFilename: 'js/[name]-[chunkhash].js'
  },

  module: {
    rules: [
      // TypeScript
      { test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.build.json'
          }
        }] },

      // Source map extraction
      { test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: [
          /node_modules/ // don't pull in vendor sourcemaps for production
                         // builds, increased speed for build
        ] }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      // Alias "@" paths
      "@": path.join(__dirname, 'src'),

      // Special config path based on environment
      config$: path.join(__dirname, 'config', NODE_ENV)
    }
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        prodLike ? 'production' : NODE_ENV)
    }),

    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      excludeChunks: ['ui']
    })
  ]
};

if (prodLike) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      screw_ie8: true,

      // Disable warnings about un-reachable conditions and what not. Most
      // of those are intentional (e.g. via webpack.DefinePlugin)
      warnings: false
    },
    sourceMap: true
  }));
}

else {
  config.devServer = {
    contentBase: path.join(__dirname, 'public'),
    port: 5000,
    historyApiFallback: true
  };
}

module.exports = config;
