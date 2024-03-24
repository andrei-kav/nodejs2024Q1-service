# Home Library Service

## Installing NPM modules

```
npm install
```

## Running API (production mode)
* Create the `.env` file in root folder with the info based on the `.env.example`
  provide `PSQL_HOST` with the value `db_container` (PSQL_HOST="db_container"). `db_container` is the container name when database will be running
  `PSQL_USER` may be random (f.i. `admin`)
  `PSQL_PASSWORD` may be random (f.i. `admin`)
* run `npm run docker:compose:prod:up` to run API
* run `npm run docker:compose:prod:down` to clean up containers

# Other cases of running

## Running API in development mode
* Create the `.env` file in root folder with the info based on the `.env.example`
  provide `PSQL_HOST` with the value `db_container` (PSQL_HOST="db_container"). `db_container` is the container name when database will be running
  `PSQL_USER` may be random (f.i. `admin`)
  `PSQL_PASSWORD` may be random (f.i. `admin`)
* run `npm run docker:compose:dev:up` to run API
* run `npm run docker:compose:dev:down` to clean up containers

## Running API using IMAGES (api and DB are in images uploaded to docker hub)
* Create the `.env` file in root folder with the info based on the `.env.example`
  provide `PSQL_HOST` with the value `db_container` (PSQL_HOST="db_container"). `db_container` is the container name when database will be running
  `PSQL_USER` may be random (f.i. `admin`)
  `PSQL_PASSWORD` may be random (f.i. `admin`)
* run `npm run docker:compose:images:up` to run API
* run `npm run docker:compose:images:down` to clean up containers

## Running API from scratch (database image will be created from scratch)
* Create the `.env` file in root folder with the info based on the `.env.example`
  provide `PSQL_HOST` with the value `db_container` (PSQL_HOST="db_container"). `db_container` is the container name when database will be running
  `PSQL_USER` may be random (f.i. `admin`)
  `PSQL_PASSWORD` may be random (f.i. `admin`)
* run `npm run docker:compose:scratch:up` to run API
* run `npm run docker:compose:scratch:down` to clean up containers

## Running API LOCALLY
* Make sure you have postgres installed locally and postgres server is running
* Create the `.env` file in root folder with the info based on the `.env.example`
  provide `PSQL_HOST` with the value `localhost` (PSQL_HOST="localhost")
  provide `PSQL_USER` with your postgres user (f.i. PSQL_USER="postgres")
  provide `PSQL_PASSWORD` with your postgres user password (f.i. PSQL_PASSWORD="root")
* run `npx prisma migrate dev --name init` to create a database
* then run either
development mode
```
npm run start
```
development --watch mode
```
npm run start:dev
```
production mode
```
npm run build && npm run start:prod
```
* application is running on the PORT from `.env` file (4000 by default)


## Scan vulnerabilities
Make sure you have docker scout plugin installed: https://docs.docker.com/scout/install/
* run `npm run docker:scout:api` to scan api image uploaded to docker hub
* run `npm run docker:scout:db` to scan database image uploaded to docker hub
* run `npm run docker:scout` to scan both images

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Docker

- Application container

To build docker image go to root folder and run
```
docker build -t {imageName}:{tag} . -f ./docker/app/Dockerfile
```
then to run the image (container will be created automatically)
```
 docker run --publish {PORT}:{PORT} {imgName}:{imgTag}
```
only create a container
```
docker create --name={containerName} {imgName}:{imgTag}
```
create a zip from a container
```
docker export {containerName} > zipName.tar
```

### Docker-compose
To build docker image run
```
docker-compose build
```
To build docker image (if it is need), create container and run it thereafter, in root folder run
```
docker-compose up
```
To clean docker containers run 
```
docker-compose down
```
To clean docker containers and volumes run 
```
docker-compose down --volumes
```

### Docker push
First login into docker hub
```
docker login
```
Then you have to create a tagged version of the required image
```
docker tag {image_name}:{tag} {docker_hub_ID}/{image_name}:{new_tag}
```
Push the tagged image you just created
```
docker push {docker_hub_ID}/{image_name}:{new_tag}
```

### Prisma
run to migrate db 
```
npx prisma migrate dev --name init
```