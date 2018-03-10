import api from '@/services/api'

export default {
  /**
   * authService.register({
   *   email: 'example@qq.com',
   *   password: 'example'
   * })
   * @param {*} credentials
   */
  getPosts () {
    return api().get('posts')
  },
  getPostsAdmin (credentials) {
    return api().post('admin/posts', credentials)
  },
  getPersonPosts (id) {
    return api().get('posts/user/' + id)
  },
  getPersonPostsAdmin (credentials, id) {
    return api().post('admin/posts/user/' + id, credentials)
  },
  getConcernPosts (data) {
    return api().post('posts/follow', data)
  },
  getPost (id) {
    return api().get('post/' + id)
  },
  getPostAdmin (credentials, id) {
    return api().post('admin/post/' + id, credentials)
  },
  favouritePost (data) {
    return api().post('post/favourite', data)
  },
  unfavouritePost (data) {
    return api().post('post/unfavourite', data)
  },
  addPost (data) {
    return api().post('post/add', data)
  },
  updatePost (data, id) {
    return api().post('post/update/' + id, data)
  },
  togglePost (data) {
    return api().post('post/toggle', data)
  },
  addComment (data, id) {
    return api().post('post/comment/add/' + id, data)
  },
  updateComment (data, id) {
    return api().post('post/comment/update/' + id, data)
  },
  toggleComment (data) {
    return api().post('post/comment/toggle', data)
  },
  favouriteComment (data) {
    return api().post('post/comment/favourite', data)
  },
  unfavouriteComment (data) {
    return api().post('post/comment/unfavourite', data)
  },
  deletePost (data) {
    return api().post('post/delete', data)
  },
  deleteComment (data) {
    return api().post('post/comment/delete', data)
  },
  uploadImg (data) {
    var config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return api().post('post/image', data, config)
  }
}
