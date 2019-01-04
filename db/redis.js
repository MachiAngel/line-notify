const Redis = require('ioredis');

const environment = process.env.NODE_ENV || 'development'
const config = require('../Redisfile.js')[environment];


const redis = new Redis(config)

module.exports = redis 
