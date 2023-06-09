![nodejs](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/7e3f6269-f730-48b8-9ece-1a719664d13f)
![Docker](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/947d8c00-1a6b-4082-9a8f-7a8e5861e471)
# Node.js-REST-API
Node.js REST API inculdes end2end encryption, tokens authentication and refreshing, requests looger, mongoDb replica set with cahing database using Redis replica set, and Nginx for load balacer.







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

