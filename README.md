# Parking
> Parking

## Requirements

- [Node v8.12+](https://nodejs.org/en/download/package-manager/)
- [mongodb v3.6+] (https://www.mongodb.com/download-center/)

## Install It
```
npm install
```

## Setup mongo connector
> Edit dist/datasources.[NODE_ENV].js

```json
{
  "db": {
    "host": "",
    "port": 19060,
    "database": "",
    "password": "",
    "user": "",
    "connector": "mongodb"
  }
}
```

## Run in *development* mode:

```
export NODE_ENV=development
node .
```

## Run in *staging* mode:

```
export NODE_ENV=staging
node .
```

#### Run in *production* mode:

```
export NODE_ENV=production
node .
```

### Try It
* Point you're browser to [http://localhost:3000](http://localhost:3000)
* Invoke the parking REST endpoint `curl http://localhost:3000/explorer`

## Contributions
Contributions are very welcome.

