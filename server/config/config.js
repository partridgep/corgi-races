require('dotenv').config({ path: '../.env' });

console.log(process.env.DATABASE_USERNAME)
console.log(process.env.DATABASE_PASSWORD)
console.log(process.env.DATABASE_NAME)
console.log(process.env.DATABASE_HOST)
console.log(process.env.DATABASE_PORT)

module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
    logging: console.log, // Enable detailed logging,
    dialectOptions: {
      connectTimeout: 60000 // Increase timeout to 60 seconds
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000, // Increase acquire timeout to 60 seconds
      idle: 10000
    }
  },
  test: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "postgres"
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "postgres"
  }
}