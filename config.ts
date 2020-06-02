export const config = () => ({
    port: process.env.PORT,
    database: {
        "type": "mysql",
        "host": process.env.TYPEORM_HOST,
        "port": 3306,
        "username": process.env.TYPEORM_USERNAME,
        "password": process.env.TYPEORM_PASSWORD,
        "database": process.env.TYPEORM_DATABASE,
        "migrationsTableName": "migrations",
        "synchronize": true,
        "entities": [
            "dist/**/*.entity.js"
        ],
        "migrations": [
            "src/migration/*{.js,.ts}"
        ],
        "cli": {
            "entitiesDir": "src/entity",
            "migrationsDir": "src/migration"
        }
    }
})