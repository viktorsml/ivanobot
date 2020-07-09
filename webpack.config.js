const path = require('path');
const nodeExternals = require('webpack-node-externals');

const webpackConfiguration = {
  entry: {
    bot: './src/bot/bot.ts',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
  resolve: {
    modules: [path.resolve(__dirname, '/src'), 'node_modules/'],
    descriptionFiles: ['package.json'],
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};

module.exports = webpackConfiguration;
