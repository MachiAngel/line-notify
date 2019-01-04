module.exports = {

  development: {
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: '',
    db: 0
  },
  production: {
    port: 6379,          // Redis port
    host: process.env.REDIS_HOST,   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: '',
    db: 0
  }

};