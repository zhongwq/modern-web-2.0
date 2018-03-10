<template>
  <div class="setting basic-div">
    <h1 class="div-header">Setting</h1>
    <div class="left">
      <ul class="info-content">
        <li><span class="bold-span">Username:</span>
          <v-text-field
            name="username"
            label="Username"
            v-model="username"
            single-line
          ></v-text-field>
        </li>
        <li><span class="bold-span">Email:</span>
          <v-text-field
            name="email"
            label="Email"
            v-model="email"
            single-line
          ></v-text-field>
        </li>
        <v-btn
          class="cyan"
          @click="updateInfo"
        >Update</v-btn>
      </ul>
    </div>
    <div class="right">
      <div class="logo" :style="{backgroundImage: 'url(http://localhost:8081/' + $store.state.user.path + ')'}"></div>
      <form id="uploadForm" v-show="false">
        <input
          type="file"
          id="imageUploader"
          name="image"
          accept=".jpg, .jpeg, .png, .gif, .bmp"
          @change="updateImage"/>
      </form>
      <div class="imgBtn">
        <v-btn
          class="cyan"
          @click="showUploader"
        >更换图像</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService'

export default {
  data () {
    return {
      email: '',
      username: ''
    }
  },
  created () {
    this.email = this.$store.state.user.email
    this.username = this.$store.state.user.username
  },
  methods: {
    async fetchData () {
      const response = await authService.getData(this.$store.state.user.id)
      var user = response.data.user
      user.follow = response.data.follow
      this.$store.dispatch('setUser', user)
      this.email = this.$store.state.user.email
      this.username = this.$store.state.user.username
    },
    async updateInfo () {
      try {
        var response = await authService.updateInfo({
          token: this.$store.state.token,
          id: this.$store.state.user.id,
          email: this.email,
          username: this.username
        })
        this.$store.dispatch('addSuccess', response.data.info)
        this.fetchData()
      } catch (err) {
        this.$store.dispatch('addError', err.response.data.error)
      }
    },
    showUploader () {
      $('#imageUploader').click()
    },
    async updateImage () {
      try {
        var formData = new FormData()
        formData.append('username', this.$store.state.user.username)
        formData.append('token', this.$store.state.token)
        formData.append('image', $('#imageUploader')[0].files[0])
        var response = await authService.updateImage(formData)
        this.$store.dispatch('addSuccess', response.data.info)
        this.fetchData()
      } catch (err) {
        console.log(err)
        this.$store.dispatch('addError', err.response.data.error)
      }
    }
  }
}
</script>

<style scoped>
.setting {
  width: 100%;
  height: 800px;
  padding: 20px 50px;
}
.logo {
  width: 200px;
  height: 200px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  margin: 0 auto 20px auto;
}
.left {
  float: left;
  width: 60%;
  padding: 10% 0;
}
.right {
  padding: 15% 30px;
  float: right;
  width: 40%;
}
.info-content {
  font-size: 20px;
  padding: 30px 50px;
  width: 500px;
}
.info-content li{
  list-style: none;
  margin-bottom: 20px;
}
.imgBtn {
  width: 100px;
  margin: auto;
}
</style>
