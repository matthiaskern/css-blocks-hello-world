const { Rewriter, Analyzer } = require('@css-blocks/jsx');
const { CssBlocksPlugin } = require('@css-blocks/webpack');

const jsxCompilationOptions = {
  compilationOptions: {},
  optimization: {
    rewriteIdents: true,
    mergeDeclarations: true,
    removeUnusedStyles: true,
    conflictResolution: true
  }
};

const rewriter = new Rewriter();
const analyzer = new Analyzer(
  __dirname + '/src/index.jsx',
  jsxCompilationOptions
);

module.exports = {
  entry: ['./src/index.jsx'],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                require('@css-blocks/jsx/dist/src/transformer/babel').makePlugin(
                  {
                    rewriter
                  }
                )
              ],
              parserOpts: {
                plugins: ['jsx']
              }
            }
          },
          {
            loader: require.resolve('@css-blocks/webpack/dist/src/loader'),
            options: {
              analyzer,
              rewriter
            }
          }
        ]
      },
      {
        test: /.css$/,
        loader: require.resolve('file-loader')
      }
    ]
  },
  plugins: [
    new CssBlocksPlugin({
      analyzer,
      outputCssFile: 'bundle.css',
      ...jsxCompilationOptions
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  }
};
