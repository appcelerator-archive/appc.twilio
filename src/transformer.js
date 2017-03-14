module.exports = {
  transformToCollection: (Model, data) => {
    return data.map((item, index) => {
      const instance = Model.instance(item, true)
      instance.setPrimaryKey(index + 1)
      return instance
    })
  },
  transformToModel: (Model, data) => {
    return Model.instance(data, true)
  }
}
