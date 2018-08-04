const scope = "production";
const config = require('./config.json');
Object.keys(config[scope]).forEach((key) => {
  process.env[key] = config[scope][key];
});
