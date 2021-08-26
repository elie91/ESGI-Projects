const path = require('path');
const validator = require('jsonschema').Validator;
const v = new validator();

module.exports = app => {
  // Load either config-dev.json or config-dev.json, regarding the NODE_ENV variable
  const env = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev' ? '-dev' : '';
  const config = `./config${env}.json`;

  app.config = require(path.resolve(__dirname, config));
  schema = require(path.resolve(__dirname, `config-validator`));

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
