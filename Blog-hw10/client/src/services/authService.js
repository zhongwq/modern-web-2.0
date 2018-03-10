import api from '@/services/api'

export default {
  /**
   * authService.register({
   *   email: 'example@qq.com',
   *   password: 'example'
   * })
   * @param {*} credentials
   */
  register (credentials) {
    return api().post('register', credentials)
  },
  login (credentials) {
    return api().post('login', credentials)
  },
  getData (id) {
    return api().get('userdata/' + id)
  },
  getTopUsers () {
    return api().get('topusers')
  },
  followUser (credentials) {
    return api().post('follow', credentials)
  },
  unfollowUser (credentials) {
    return api().post('unfollow', credentials)
  },
  updateInfo (credentials) {
    return api().post('updateInfo', credentials)
  },
  updateImage (data) {
    var config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return api().post('updateImg', data, config)
  },
  changePower (credentials) {
    return api().post('changePower', credentials)
  },
  getFollowUser (id) {
    return api().get('followUser/' + id)
  },
  getFollower (id) {
    return api().get('follower/' + id)
  }
}
