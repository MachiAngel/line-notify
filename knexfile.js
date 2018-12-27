require('dotenv').config()

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: '',
      password: '',
      database: 'smart-brain',
      ssl: false
    }
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      ssl: true
    },
    pool: { min: 0, max: 5 }
  }

};
