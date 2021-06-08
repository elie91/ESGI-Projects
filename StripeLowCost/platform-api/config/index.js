const path = require('path');
const validator = require('jsonschema').Validator;
const v = new validator();

module.exports = app => {
  // Load either config.json or config-dev.json, regarding the NODE_ENV variable
  const env = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev' ? '-dev' : '';
  const config = `./config${env}.json`;

  // Twig
  app.set('views', path.dirname(require.main.filename || process.mainModule.filename) + '/views');
  app.set('view engine', 'twig');
  app.set('twig options', {
    strict_variables: false
  })

  app.config = require(path.resolve(__dirname, config));

  const schema = require(path.resolve(__dirname, `config-validator`));

  let validation = v.validate(app.config, schema);
  // Verify is the config format correspond to the config-validator
  if(!validation.valid){
    // Log the difference between the to files 
    // And end process with error code
    console.log({
      error: `ConfigLoadingError`, 
      name: `ConfigFormatDoesNotMatchValidator`,
      message: validation.errors
    });
    process.exit(1)
  }

};
