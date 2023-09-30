const path = require('path');
const nodeExternals = require('webpack-node-externals')

const commonConfig = {
  mode: 'production',
  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
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
}

const serverConfig = {
  ...commonConfig,

  name: 'server',
  target: 'node',
  
  externalsPresets: { node: true },

  externals: [nodeExternals()],

  entry: {
    app: './src/server/index.ts',
  },

  output: {
    path: path.join(process.cwd(), 'build/server'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    publicPath: '/',
    hashDigestLength: 20,
  },
}

const clientConfig = {
  ...commonConfig,

  name: 'client',
  target: 'web',

  entry: {
    app: './src/public/index.tsx',
  },

  output: {
    path: path.join(process.cwd(), 'build/public'),
    filename: '[name].js',
    publicPath: '/',
  }
}

module.exports = () => {
  return [
    clientConfig,
    serverConfig,
  ];
}

