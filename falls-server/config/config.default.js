exports.keys = '330203'

exports.mongoose = {
  client: {
    url: 'mongodb://127.0.0.1:27017/falls',
    options: {}
  }
}

exports.security = {
  csrf: {
    enable: false,
    ignoreJSON: true
  },
  domainWhiteList: [ 
    'http://localhost:8080'
  ]
}