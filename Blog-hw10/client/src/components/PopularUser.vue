<template>
  <div class="basic-div user-list-div" id="popular-user">
    <h2 class="div-header">热门推荐</h2>
    <ul class="user-list">
      <li v-for="(user, index) in users" class="user-item" :key="user.id">
        <div @click="moveToProfile(user.id)">
          <div class="logo" :style="{backgroundImage: 'url(http://localhost:8081/' + user.path + ')'}"></div><h3 class="user-name">{{user.username}}</h3>
        </div>
        <v-btn class="move" fab dark small color="blue-grey" @click="move(index)">
          <v-icon dark>fa-times</v-icon>
        </v-btn>
      </li>
    </ul>

  </div>
</template>

<script>
import authService from '@/services/authService'

export default {
  data () {
    return {
      users: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      var getdata = await authService.getTopUsers()
      this.users = getdata.data.result
    },
    move (index) {
      this.users.splice(index, 1)
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
#popular-user {
  height: 394px;
  overflow: hidden;
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
.move {
  position: relative;
  top: -50px;
  left: 240px;
}
</style>
