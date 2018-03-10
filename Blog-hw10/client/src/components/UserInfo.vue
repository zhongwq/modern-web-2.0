<template>
  <div class="basic-div" id="info" @click="$router.push({name: 'Profile', params: {id: userId}})">
    <div class="logo" :style="{backgroundImage: 'url(http://localhost:8081/' + user.path + ')'}"></div>
    <div class="basic-info">
      <ul class="info-list">
        <li class="username">{{user.username}}</li>
        <li>
          <div class="meta">
            <h4 class="meta-header"><v-icon class="icon">fa-file</v-icon> 文章</h4>
            <p>{{posts.length}}</p>
          </div>
          <div class="meta">
            <h4 class="meta-header"><v-icon class="icon">fa-heart</v-icon> 关注</h4>
            <p>{{follow.length}}</p>
          </div>
          <div class="meta">
            <h4 class="meta-header"><v-icon class="icon">fa-star</v-icon> 粉丝</h4>
            <p>{{user.follower.length}}</p>
          </div>
        </li>
        <div class="button-list" v-if="showButton">
          <li v-if="this.$store.state.user.id === this.userId || this.$store.state.user.follow.indexOf(this.userId) !== -1">
            <v-btn color="error" @click="unfollowUser">Unfollow</v-btn>
          </li>
          <li v-else>
            <v-btn color="success" @click="followUser">Follow</v-btn>
          </li>
          <div v-if="$store.state.user.UserRoleId < this.user.UserRoleId">
            <li v-if="user.UserRoleId > 1">
              <v-btn color="success" @click="changePower">升级为管理员</v-btn>
            </li>
            <li v-else>
              <v-btn color="error" @click="changePower">解除管理员职务</v-btn>
            </li>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService'

export default {
  props: {
    userId: Number
  },
  data () {
    return {
      user: {
        path: './public/images/default.jpg',
        follower: []
      },
      posts: [],
      follow: []
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route.params': 'fetchData'
  },
  computed: {
    showButton () {
      return (this.$store.state.isUserLoggedIn && (this.$store.state.user.id !== this.userId))
    },
    followed () {
      return (this.$store.state.user.id === this.userId || this.$store.state.user.follow.indexOf(this.userId) !== -1)
    }
  },
  methods: {
    async fetchData () {
      var getdata = await authService.getData(this.userId)
      this.user = getdata.data.user
      this.posts = getdata.data.posts
      this.follow = getdata.data.follow
    },
    async followUser () {
      try {
        var response = await authService.followUser({id: this.userId, token: this.$store.state.token})
        this.$store.dispatch('followUser', this.userId)
        this.$store.dispatch('addSuccess', response.data.info)
        this.fetchData()
      } catch (err) {
        this.$store.dispatch('addError', err.response.data.error)
      }
    },
    async unfollowUser () {
      try {
        var response = await authService.unfollowUser({id: this.userId, token: this.$store.state.token})
        this.$store.dispatch('unfollowUser', this.userId)
        this.$store.dispatch('addSuccess', response.data.info)
        this.fetchData()
      } catch (err) {
        this.$store.dispatch('addError', err.response.data.error)
      }
    },
    async changePower () {
      try {
        var response = await authService.changePower({
          token: this.$store.state.token,
          id: this.user.id
        })
        this.$store.dispatch('addSuccess', response.data.info)
        this.fetchData()
      } catch (err) {
        this.$store.dispatch('addError', err.response.data.error)
      }
    }
  }
}
</script>

<style scoped>
#info {
  padding: 20px 0 10px 0;
  width: 100%;
  height: auto;
  background: white;
  margin-bottom: 10px;
  cursor: pointer;
}
.logo {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  border-radius: 50%;
  margin: auto;
}
.basic-info {
  width: 250px;
  text-align: center;
  margin: 10px auto 0 auto;
}
.username {
  font-size: 20px;
  margin-bottom: 15px;
}
.info-list li {
  list-style: none;
}
.meta {
  width: 30%;
  display: inline-block;
  border-right: 1px solid #eee;
}
.meta:last-child {
  border: none;
  margin-bottom: 10px;
}
.meta-header {
  margin-bottom: 10px;
}
.icon {
  font-size: 16px;
  vertical-align: baseline;
}
</style>
