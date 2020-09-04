// environment variables only, database config
const { createApp } = require('./src/app')

const {
    PORT = process.env.PORT || 3003,
    HOST = '35.240.192.232',
    // HOST = '34.87.83.81',
    // HOST = 'localhost',
    DB_USER = 'tddakk',
    // DB_USER = 'root',
    // DB_PASS = '0mqMw0Gis8I5zi2v',
    DB_PASS = '123456',
    DB_NAME = 'semo_2.0',
} = process.env

// by doing this, app needs not to be initiated first, we can put vars into it
const appOptions = {
    database: {
        dbHost: HOST,
        dbUser: DB_USER,
        dbPass: DB_PASS,
        dbName: DB_NAME,
    }
}

// createApp now returns a Promise because it is an async func
createApp(appOptions)
    .then((app) => {
        // So we need to wrap the `app.listen` inside a `.then`
        app.listen(PORT, () => {
            console.info(`App is running at ${PORT}`)
            console.log(PORT);
        })
    })

