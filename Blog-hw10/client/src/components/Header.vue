<template>
  <v-toolbar fixed class="blue">
    <v-toolbar-title class="mr-4">
      <span
        class="home"
        @click="navigateTo({name: 'Posts'})">
        Blog
      </span>
    </v-toolbar-title>
    <v-toolbar-items v-if="$store.state.isUserLoggedIn">
      <v-btn flat dark @click="navigateTo({name: 'Posts', query: {mode: 'concern'}})" v-if="$store.state.isUserLoggedIn">
        Concern
      </v-btn>
      <v-btn flat dark @click="navigateTo({name: 'AddPost'})">
        AddPost
      </v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <search-bar v-if="this.$route.path == '/posts'"/>
    <v-toolbar-items v-if="$store.state.isUserLoggedIn">
      <v-btn flat dark @click="navigateTo({name: 'Setting'})">
        Setting
      </v-btn>
      <v-btn flat dark @click="logout">
        Logout
      </v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-else>
      <v-btn flat dark @click="navigateTo({name: 'Login'})">
        Login
      </v-btn>
      <v-btn flat dark @click="navigateTo({name: 'Register'})">
        Signup
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import SearchBar from './SearchBar.vue'

export default {
  data () {
    return {
      search: false,
      searchContent: ''
    }
  },
  components: {
    SearchBar
  },
  methods: {
    navigateTo (target) {
      this.$router.push(target)
    },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({name: 'Posts'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  cursor: pointer;
}

.home:hover {
  color: #464141;
}
</style>
