# Node.js-REST-API
Node.js REST API inculdes end2end encryption, tokens authentication and refreshing, requests looger, mongoDb replica set with cahing database using Redis replica set, and Nginx for load balacer.


 ![Docker](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/301dd7d4-b091-4ffc-995f-110eadf6e5c7)




### Env Variables

Rename the `.env` files to `.env` and add the following

```
NODE_ENV= "development"
MONGO_HOST="mongo1:27017,mongo2:27017,mongo3:27017"
MONGO_USER="user"
MONGO_PASSWORD="userPass"
DB_NAME= "RESTapiDb"
MONGO_URI= "mongodb://mongo1:27017,mongo2:27017,mongo3:27017/?replicaSet=dbrs"
PORT= 7743
JWT_SECRET= "webTokenSecret"
ENCRYP_KEY= "API Encryption key"
REDIS_HOST= "redis-master"
REDIS_PORT= 6379
REDIS_MAX_RETRIES=3
REDIS_PASSWORD= "password"
LOG_FILE_ROTATION= "30d"
LOG_FILE_SIZE= "50M"
```

if you crete a user to mongodb replica, you need to chnges this in the init.js file too.


### Run
./Start.sh

