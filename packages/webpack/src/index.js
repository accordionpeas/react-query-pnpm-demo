const path = require('path');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
const LoadablePlugin = require('@loadable/webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { createLoadableComponentsTransformer } = require('typescript-loadable-components-plugin')
const nodeExternals = require('webpack-node-externals')

const styledComponentsTransformer = createStyledComponentsTransformer()

const common = ({ isClient, isProduction }) => {
  const rules = [
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        transpileOnly: true,
        getCustomTransformers: (program) => ({
          before: [styledComponentsTransformer, createLoadableComponentsTransformer(program, {})],
        }),
        ...isClient && {
          compilerOptions: {
            module: 'ESNext', // needed for loadable-components
          },
        },
      },
    },
  ]
  
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: 'source-map',
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json'],
    },

    module: {
      rules,
    },

    watchOptions: {
      ignored: ['node_modules', 'build'],
    },
  }
};

const server = (isProduction) => ({
  name: 'server',
  target: 'node',
  
  externalsPresets: { node: true },

  externals: [nodeExternals({})],

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

  ...!isProduction && {
    plugins: [
      new NodemonPlugin(),
    ],
  },
})

const lib = (isProduction) => ({
  name: 'lib',
  target: 'node',
  
  externals: [nodeExternals({})],

  entry: {
    app: './src/index.ts',
  },

  output: {
    path: path.join(process.cwd(), 'build'),
    libraryTarget: 'commonjs2',
    filename: 'index.js',
    publicPath: '/',
    hashDigestLength: 20,
  },

  ...!isProduction && {
    plugins: [
      new NodemonPlugin(),
    ],
  },
})

const client = (isProduction) => ({
  name: 'client',
  target: 'web',

  entry: {
    app: './src/public/index.tsx',
  },

  output: {
    path: path.join(process.cwd(), 'build/public'),
    filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    publicPath: '/',
    hashDigestLength: 20,
  },

  plugins: [
    new WebpackManifestPlugin({
      map: (fileDescriptor) => ({
        ...fileDescriptor,
        name: fileDescriptor.name.replace(/([a-f0-9]{32}\.?)/gi, ''),
      }),
    }),
    new LoadablePlugin(),
    new NodePolyfillPlugin(),
  ],
})

module.exports = (env, arg, isLib) => {
  const isProduction = arg.mode === 'production'

  const clientCommon = common({ isProduction, isClient: true })
  const nodeCommon = common({ isProduction, isClient: false })

  const clientConfig = [
    {
      ...clientCommon,
      ...client(isProduction),
    },
  ];

  const serverConfig = [
    {
      ...nodeCommon,
      ...server(isProduction),
    },
  ];

  if (isLib) {
    return [
      {
        ...nodeCommon,
        ...lib(isProduction),
      }
    ]
  }
  
  return [
    ...clientConfig,
    ...serverConfig,
  ];
}
