var Arrow = require('arrow')

module.exports = Arrow.createModel('notification', {
  fields: {
    firstPageUri: { type: String },
    end: { type: Number },
    previousPageUri: { type: String },
    uri: { type: String },
    pageSize: { type: Number },
    page: { type: Number },
    notifications: { type: Array },
    nextPageUri: { type: String },
    start: { type: Number }
  },
  connector: 'appc.twilio',
  actions: ['read']
})
