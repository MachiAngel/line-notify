// Update with your config settings.

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
  staging: {
    client: 'pg',
    connection: {
      host: '220.130.207.145',
      port:'32776',
      database: 'line-notify',
      user: 'angel',
      password: 'angel'
    }
  },
  production: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: '',
      password: '',
      database: 'smart-brain',
      ssl: false
    }
  }

};
