# Home Library Service

## Installing NPM modules

```
npm install
```

## Building application
```
npm run build
```
## Running application
Before running create the `.env` file in root folder with the info based on the `.env.example`

To run in development mode
```
npm run start
```
To run in development --watch mode
```
npm run start:dev
```
To run in production mode
```
npm run start:prod
```


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
then to run the image
```
 docker run --publish {PORT}:{PORT} {imgName}:{imgTag}
```

To build docker image (if it is need), create container and run it thereafter, go to docker folder and run
```
docker-compose up
```