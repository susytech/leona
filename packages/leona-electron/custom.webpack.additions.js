// https://webpack.electron.build/add-ons
// https://www.npmjs.com/package/webpack-build-notifier
const path = require('path');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const withWebpackBuildNotifier = process.env.NOTIFIER === 'true';

module.exports = withWebpackBuildNotifier
  ? {
    plugins: [
      new WebpackBuildNotifierPlugin({
        title: 'Leona Webpack Build',
        logo: path.resolve('./build/icons/icon.ico'),
        suppressSuccess: false,
        compileIcon: path.resolve('./build/icons/webpack/compile.png'),
        failureIcon: path.resolve('./build/icons/webpack/failure.png'),
        successIcon: path.resolve('./build/icons/webpack/success.png'),
        warningIcon: path.resolve('./build/icons/webpack/warning.png')
      })
    ]
  }
  : {};
