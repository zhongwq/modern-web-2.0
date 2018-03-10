import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: (sessionStorage.getItem('token') !== 'null') ? sessionStorage.getItem('token') : null,
    user: (sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : null,
    isUserLoggedIn: (sessionStorage.getItem('userStatus') === 'true') || false,
    error: [],
    success: []
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      sessionStorage.token = token
      if (token) {
        state.isUserLoggedIn = true
        sessionStorage.userStatus = true
      } else {
        state.isUserLoggedIn = false
        sessionStorage.userStatus = false
      }
    },
    setUser (state, user) {
      state.user = user
      sessionStorage.user = JSON.stringify(user)
    },
    addError (state, error) {
      state.error.push(error)
    },
    removeError (state, error) {
      for (var i = 0, len = state.error.length; i < len; i++) {
        if (state.error[i] === error) {
          state.error.splice(i, 1)
          break
        }
      }
    },
    followUser (state, userId) {
      state.user.follow.push(userId)
      sessionStorage.user = JSON.stringify(state.user)
    },
    unfollowUser (state, userId) {
      for (var i = 0, len = state.user.follow.length; i < len; i++) {
        if (state.user.follow[i] === userId) {
          state.user.follow.splice(i, 1)
          break
        }
      }
      sessionStorage.user = JSON.stringify(state.user)
    },
    addSuccess (state, success) {
      state.success.push(success)
    },
    removeSuccess (state, success) {
      for (var i = 0, len = state.success.length; i < len; i++) {
        if (state.success[i] === success) {
          state.success.splice(i, 1)
          break
        }
      }
    }
  },
  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    },
    followUser ({commit}, userId) {
      commit('followUser', userId)
    },
    unfollowUser ({commit}, userId) {
      commit('unfollowUser', userId)
    },
    addError ({commit}, error) {
      commit('addError', error)
    },
    removeError ({commit}, error) {
      commit('removeError', error)
    },
    addSuccess ({commit}, success) {
      commit('addSuccess', success)
    },
    removeSuccess ({commit}, success) {
      commit('removeSuccess', success)
    }
  }
})
