# Node.js-REST-API
Node.js REST API inculdes end2end encryption, tokens authentication and refreshing, requests looger, mongoDb replica set and cahing database with Redis replica set, and Nginx for load balacer.




![Node js_logo](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/0f56c9ad-75d8-4aaa-9665-f6e9910569ad) ![mongo](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/6a5844b3-3d03-47cf-91ea-d0e2a6466aa2) ![redis](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/2febc097-7087-4cb0-ae56-31daa651e890) ![NGINX](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/22405bb8-5923-4928-a4fb-b6826ff33824) ![Docker](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/301dd7d4-b091-4ffc-995f-110eadf6e5c7)




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

