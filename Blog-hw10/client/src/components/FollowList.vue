<template>
  <div class="basic-div user-list-div" id="follower-list">
    <h2 class="div-header">关注列表</h2>
    <ul class="user-list">
      <li v-for="user in users" class="user-item" :key="user.id">
        <div @click="moveToProfile(user.id)">
          <div class="logo" :style="{backgroundImage: 'url(http://localhost:8081/' + user.path + ')'}"></div><h3 class="user-name">{{user.username}}</h3>
        </div>
      </li>
    </ul>

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
      users: []
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route.params': 'fetchData'
  },
  methods: {
    async fetchData () {
      var getdata = await authService.getFollowUser(this.userId)
      this.users = getdata.data.follow
    },
    moveToProfile (userId) {
      this.$router.push({name: 'Profile', params: {id: userId}})
    }
  }
}
</script>

<style scoped>
* {
  font-size: 18px;
}
#follower-list {
  height: 394px;
  overflow-y: scroll;
}
.logo {
  height: 50px;
  width: 50px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  border-radius: 50%;
  margin-right: 15px;
  float: left;
}
.user-list li {
  list-style: none;
  padding: 5px 5px;
  cursor: pointer;
}
.user-item {
  height: 65px;
  margin-top: 5px;
  border-bottom: 1px solid #eee;
}
.user-name {
  line-height: 50px;
}
</style>
