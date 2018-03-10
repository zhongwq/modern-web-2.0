<template>
  <div>
    <div class="posts">
      <div class="posts-content">
        <vue-loading v-if="loading" type="bars" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
        <div class="info-content" v-else-if="filteredList.length === 0"><h2>No valid Post!</h2></div>
        <ul class="posts-list" v-else>
          <li v-for="post in pageList" :key="post.id">
            <div class="basic-div post-item" v-if="post.block">
              对不起, 该内容已被管理员隐藏
            </div>
            <div class="basic-div post-item" v-else>
              <h2 class="post-title"><router-link :to="{name: 'Post', params: {id: post.id}}">{{post.title}}<span v-if="!post.status">(已隐藏)</span></router-link></h2>
              <div>
                <span class="clickable post-meta" @click="moveToProfile(post.author.id)"><span><div class="logo" :style="{backgroundImage: 'url(http://localhost:8081/' + post.author.path + ')'}"></div> {{post.author.username}}</span></span>
                <span class="post-meta"><v-icon class="meta-icon">fa-thumbs-up</v-icon> {{post.favourite.length}}</span>
                <span class="post-meta"><v-icon class="meta-icon">far fa-comments</v-icon> {{post.comments.length}}</span>
                <span class="post-meta"><v-icon class="meta-icon">fa-calendar</v-icon> {{post.updatedAt}}</span>
                <v-menu class="post-menu" v-if="editable(post)">
                  <v-btn icon slot="activator">
                    <v-icon color="black">more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile v-if="$store.state.user.id === post.author.id" @click="editPost(post.id)">
                      <v-list-tile-title>Edit</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile v-if="$store.state.user.UserRoleId <= 1" @click="togglePost(post.id)">
                      <v-list-tile-title>Toggle</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile v-if="$store.state.user.id === post.author.id" @click="deletePost(post.id)">
                      <v-list-tile-title>Delete</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <pagination :maxPage="parseInt(Math.ceil(filteredList.length/8))"/>
    </div>
    <div class="right">
      <user-info :userId="parseInt(this.$route.params.id)"/>
      <follow-list :userId="parseInt(this.$route.params.id)"/>
      <follower-list :userId="parseInt(this.$route.params.id)"/>
    </div>
  </div>
</template>

<script>
import vueLoading from 'vue-loading-template'
import postService from '@/services/postService'
import Pagination from './Pagination'
import FollowerList from './FollowerList'
import UserInfo from './UserInfo'
import FollowList from './FollowList'

export default {
  data () {
    return {
      posts: [],
      loading: true,
      successMsg: '',
      error: ''
    }
  },
  components: {
    vueLoading,
    UserInfo,
    Pagination,
    FollowerList,
    FollowList
  },
  computed: {
    filteredList () {
      var keyword = ''
      if (this.$route) {
        keyword = (this.$route.query.keyword || '').toLowerCase()
      }
      return this.posts
        .filter(item => (item.title.toLowerCase().indexOf(keyword) !== -1))
    },
    pageList () {
      var keyword = ''
      var page = this.$route.query.page || 1
      if (this.$route) {
        keyword = (this.$route.query.keyword || '').toLowerCase()
      }
      return this.posts
        .filter(item => (item.title.toLowerCase().indexOf(keyword) !== -1))
        .slice((page - 1) * 8, page * 8)
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    closeSuccessAlert () {
      this.successMsg = ''
    },
    closeErrorAlert () {
      this.error = ''
    },
    async fetchData () {
      this.loading = true
      var getdata
      if (this.$store.state.isUserLoggedIn && this.$store.state.user.UserRoleId <= 1) {
        getdata = await postService.getPersonPostsAdmin({token: this.$store.state.token}, this.$route.params.id)
      } else {
        getdata = await postService.getPersonPosts(this.$route.params.id)
      }
      this.posts = getdata.data.posts
      this.loading = false
    },
    editPost (id) {
      this.$router.push({name: 'EditPost', params: {id: id}})
    },
    async togglePost (id) {
      try {
        var response = await postService.togglePost({token: this.$store.state.token, id: id})
        this.fetchData()
        this.$store.dispatch('addSuccess', response.data.info)
      } catch (err) {
        this.$store.dispatch('addError', err.response.data.error)
      }
    },
    editable (post) {
      if (!this.$store.state.isUserLoggedIn) {
        return false
      }
      return (this.$store.state.user.UserRoleId <= 1 || this.$store.state.user.id === post.author.id)
    },
    async deletePost (postId) {
      try {
        var response = await postService.deletePost({
          id: postId,
          token: this.$store.state.token
        })
        this.$store.dispatch('addSuccess', response.data.info)
        this.fetchData()
      } catch (err) {
        this.$store.dispatch('addError', err.response.data.error)
      }
    },
    moveToProfile (userId) {
      this.$router.push({name: 'Profile', params: {id: userId}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.posts {
  width: 760px;
  float: left;
  margin-right: 10px;
}
.right {
  width: 346px;
  float: right;
}
.posts-content {
  height: 100%;
  margin: auto;
}
h2.post-title {
  color: #333;
  font-weight: bold;
  height: 24px;
  overflow: hidden;
  margin-bottom: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.posts-list {
  margin: auto;
}
.post-item {
  height: 100%;
  padding: 20px 24px;
  background: white;
}
.logo {
  height: 30px;
  width: 30px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  border-radius: 50%;
  margin-right: 15px;
  float: left;
}
.post-meta {
  padding-right: 10px;
}
.posts-list li {
  list-style: none;
  margin-bottom: 5px;
}
.post-menu {
  float: right;
  top: -10px;
  left: 20px;
}
.info-content {
  text-align: center;
}
.meta-icon {
  height: 15px;
  vertical-align: baseline;
}
</style>
