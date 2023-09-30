const path = require('path');
const nodeExternals = require('webpack-node-externals')

module.exports = () => {
  return {
    mode: 'production',
    devtool: 'source-map',
  
    resolve: {
      extensions: ['.ts', '.tsx'],
    },
  
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            transpileOnly: true,
          },
        },
      ],
    },

    name: 'lib',
    target: 'node',
    
    externals: [nodeExternals()],

    entry: {
      app: './src/index.ts',
    },

    output: {
      path: path.join(process.cwd(), 'build'),
      libraryTarget: 'commonjs2',
      filename: 'index.js',
      publicPath: '/',
    },
  }
}
