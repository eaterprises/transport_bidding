var conf = {};

// conf = { user : 'dev',
//           pwd : process.env.MONGO_PWD,
//           url : 'ds053688.mongolab.com',
//           port: '53688',
//           db: 'dev-food-transport' };

conf = { user : process.env.MONGO_USER,
          pwd : process.env.MONGO_PWD,
          url : process.env.MONGO_URL,
          port: process.env.MONGO_PORT,
          db: 'dev-food-transport' };

conf.mongoUrl = "localhost/transport-bidding" // default config
//mongolab config string
if(conf.user && conf.pwd && conf.url && conf.port && conf.db)
	conf.mongoUrl = conf.user + ':' + conf.pwd + '@' + conf.url + ':' + conf.port + '/' + conf.db;

//local instance
// conf.mongoUrl = "ds053688.mongolab.com:53688/dev-food-transport";
if(process.env.MONGO_URL_OVERRIDE)
	conf.mongoUrl = process.env.MONGO_URL_OVERRIDE;
console.log(conf.mongoUrl)
module.exports = conf;
