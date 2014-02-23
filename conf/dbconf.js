var conf = {};
// conf = { user : 'dev',
//           pwd : 'rhokpassword',
//           url : 'ds053688.mongolab.com',
//           port: '53688',
//           db: 'dev-food-transport' };
conf = { user : process.env.MONGO_USER,
          pwd : process.env.MONGO_PWD,
          url : process.env.MONGO_URL,
          port: process.env.MONGO_PORT,
          db: 'dev-food-transport' };

//mongolab config string
conf.mongoUrl = conf.user + ':' + conf.pwd + '@' + conf.url + ':' + conf.port + '/' + conf.db;


//local instance
//conf.mongoUrl = "localhost/transport-bidding";
module.exports = conf;
