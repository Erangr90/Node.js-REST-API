#!/bin/bash

DELAY=10

# Stop and remove containers

docker compose -f docker-compose-mongo.yml down || {
    echo "Error: Failed to stop mongo containers"
    exit 1
}

docker compose -f docker-compose-dev.yml down || {
    echo "Error: Failed to stop app container"
    exit 1
}


# Remove volumes
if [ -n "$(docker volume ls -q)" ]; then
    docker volume rm $(docker volume ls -q) || {
        echo "Error: Failed to remove volumes"
        exit 1
    }
fi

# Check if the network exists
docker network inspect api-network > /dev/null 2>&1
if [ $? -ne 0 ]; then
  # Network doesn't exist, so create it
  docker network create api-network || {
    echo "Error: Failed to create network"
    exit 1
  }
fi



# Start mongo containers
docker compose -f docker-compose-mongo.yml up --build -d || {
    echo "Error: Failed to start mongo containers"
    exit 1
}


# Start redis containers
docker compose -f docker-compose-redis.yml up --build -d || {
    echo "Error: Failed to start redis containers"
    exit 1
}


echo "****** Waiting for ${DELAY} seconds for containers to go up ******"
sleep $DELAY



# Start application containers
docker compose -f docker-compose-dev.yml up --build -d || {
    echo "Error: Failed to start application containers"
    exit 1
}

# Initialize replica set
docker exec mongo1 bash -c "/scripts/rs-init.sh" || {
    echo "Error: Failed to initialize mongo replica set"
    exit 1
}
