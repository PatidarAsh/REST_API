
## Requirements

* Node 8+
* Git
* CLI (only for write access)

## Common setup

Clone the repo and install the dependencies.



```bash
npm install
```

## Steps to run the project

To start the express server on PORT 8000, run the following

### Production

```bash
npm run start
```

### Development

```bash
npm run start:dev
```

Open [http://localhost:8000](http://localhost:8000) and take a look around.

## Redis Installations

```bash
redis-server
brew services start redis
brew services info redis
brew services stop redis
redis-cli
```

## RabbitMQ

Ref: https://dev.to/pharzad/introduction-to-rabbitmq-for-node-js-developers-1clm


## Docker

To delete all containers including its volumes use,

```bash
docker rm -vf $(docker ps -aq)
```

To delete all the images,

```bash
docker rmi -f $(docker images -aq)
```

To start build

```bash
docker-compose up
```

## Status

Docker status

```bash
http://localhost:9200/
```

Elasticsearch console

```bash
http://localhost:5601/app/dev_tools#/console
```


1. GET token
2. POST validate token
3. FLUSHDB
4. POST plan
5. RabbitMQ peak
6. GET plan - if-none-match eTag
7. PATCH plan - remove PlanCostServices new eTag
8. RabbitMQ peak
9. GET plan - with Patch eTag
10. DELETE plan