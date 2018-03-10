module.exports = {
  blockFalsePosts (data) {
    for (var i = 0, len = data.length; i < len; i++) {
      if (data[i].status == false)
        data[i] = {id: data[i].id, title: '', block: true}
    }
  },
  blockFalseComments (data) {
    for (var i = 0, len = data.length; i < len; i++) {
      if (data[i].status == false)
        data[i] = {id: data[i].id, content: '', block: true}
    }
  }
}