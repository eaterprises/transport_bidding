transport_bidding
=================
1. install node, npm, mongodb
2. cd into repo dir
3. Get dependencies
   ```npm install```
4. run with ```MONGO_USER=<user> MONGO_PWD=<pwd> MONGO_URL=<url> MONGO_PORT=<port> node app.js``` or:
	```MONGO_URL_OVERRIDE=<user:password@url:port/dbname> node app.js``` or:
	```export MONGO_PWD=<pwd>;```
	```node app.js;```

Configuration
=============
- MONGO_USER: database username
- MONGO_PWD : database password
- MONGO_URL : database host / url
- MONGO_PORT: data port (default: 27017)
- MONGO_URL_OVERRIDE: full connection string that can override all settings

*For Heroku deployment*
```heroku config:set NAME=value```
(e.g. heroku config:set MONGO_URL=ds053688.mongolab.com)
