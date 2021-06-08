const Encore = require('@symfony/webpack-encore');

if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/js/app.js')
    .addEntry('homepage', './assets/js/homepage.js')
    .addEntry('quote', './assets/js/quote.js')
    .addEntry('loadMore', './assets/js/loadMore.js')
    .addEntry('file', './assets/js/file.js')
    .createSharedEntry('vendor', './assets/js/vendor/index.js')
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .configureBabelPresetEnv((config) => {
      config.useBuiltIns = 'usage';
      config.corejs = 3;
    })
    .enableSassLoader()
    .copyFiles({
      from: './assets/img',
      to: '/[path][name].[ext]'
    })
    .copyFiles({
        from: './assets/file',
        to: '/[path][name].[ext]'
    })
;

module.exports = Encore.getWebpackConfig();
