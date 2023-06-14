![nodejs](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/7e3f6269-f730-48b8-9ece-1a719664d13f)
![Docker](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/947d8c00-1a6b-4082-9a8f-7a8e5861e471)
![redisLogo](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/fcb27e9b-0669-47d1-9789-7ee4cf0ab17e)
![mongoLogo (1)](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/e0eb0960-739e-4460-b5bc-5e425c91560e)
![Nginx_logo](https://github.com/Erangr90/Node.js-REST-API/assets/62970558/bd6365e1-9194-40bc-a294-0440bb482b99)

# Node.js-REST-API
Node.js REST API includes tokens authentication and refreshing, requests logger for analysis, MongoDB replica set with cahing database using Redis Master-Slave Replication, and Nginx for load balacer.







### Env Variables

Rename the `.env` files to `.env` and add the following

```
NODE_ENV= "development"
MONGO_HOST="mongo1:27017,mongo2:27017,mongo3:27017"
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

### Run
./Start.sh

