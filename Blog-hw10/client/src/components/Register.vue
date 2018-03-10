<template>
  <v-layout column>
    <v-flex xs6 offset-xs3>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Register</v-toolbar-title>
        </v-toolbar>
        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field
              name="username"
              type="string"
              v-model="username"
              label="Username"
            ></v-text-field>
          <v-text-field
              name="email"
              type="email"
              v-model="email"
              label="Email"
            ></v-text-field>
          <v-text-field
              name="password"
              type="password"
              v-model="password"
              label="Password"
            ></v-text-field>
          <br/>
          <v-btn
            class="cyan"
            @click="regist">
            Register
            </v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import authService from '@/services/authService'
export default {
  data () {
    return {
      username: '',
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    regist () {
      authService.register({
        username: this.username,
        email: this.email,
        password: this.password
      }).then((res) => {
        this.$store.dispatch('setToken', res.data.token)
        this.$store.dispatch('setUser', res.data.user)
        this.$router.push({name: 'Posts'})
      }).catch((err) => {
        this.$store.dispatch('addError', err.response.data.error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error {
  color: white;
}
</style>
