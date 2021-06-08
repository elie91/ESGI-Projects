let Encore = require('@symfony/webpack-encore');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/js/app.js')
    .addEntry('test', './assets/js/test/Test.js')
    .addEntry('user_edit', './assets/js/user/edit.js')
    .addEntry('quills', './assets/js/utils/quills.js')
    .addEntry('project', './assets/js/project/index.js')
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .enableSassLoader()
    .copyFiles({
      from: './assets/images',
      to: 'images/[path][name].[ext]',
    })
    .copyFiles({
      from: './assets/videos',
      to: 'videos/[path][name].[ext]',
    })
    .enableSingleRuntimeChunk()
    .createSharedEntry('vendor', './assets/js/vendor/index.js')

;

module.exports = Encore.getWebpackConfig();