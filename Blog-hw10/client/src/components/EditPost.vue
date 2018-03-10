<template>
  <div id="editor">
    <h1>Edit Post</h1>
    <v-container class="form-content">
      <v-layout row>
        <v-flex xs6>
          <v-flex xs6>
            <h3>Title</h3>
          </v-flex>
          <v-text-field
            name="input-1"
            placeholder="Input your title here..."
            v-model="title"
            id="post-title"
            ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6>
          <h3>Content</h3>
        </v-flex>
      </v-layout>
      <mavon-editor class="markdown-editor" v-model="content"></mavon-editor>
      <div class="button-part">
        <v-btn large color="success" dark @click="submit">Sumbit</v-btn>
        <v-btn large color="error" dark @click="clear">Clear</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import postService from '@/services/postService'

export default {
  data () {
    return {
      title: '',
      content: ''
    }
  },
  created () {
    this.fetchData()
  },
  components: {
    mavonEditor
  },
  methods: {
    async fetchData () {
      var getdata = await postService.getPost(this.$route.params.id)
      this.title = getdata.data.post.title
      this.content = getdata.data.post.content
    },
    async submit () {
      try {
        const response = await postService.updatePost({
          token: this.$store.state.token,
          title: this.title,
          content: this.content
        }, this.$route.params.id)
        this.$store.dispatch('addSuccess', response.data.info)
        this.$router.push({name: 'Post', params: {id: this.$route.params.id}})
      } catch (err) {
        this.$store.dispatch('addError', err.response.data.error)
      }
    },
    clear () {
      this.title = ''
      this.content = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#editor {
  margin: auto;
  width: 80%;
  margin-top: 0;
}
.form-content {
  height: 600px;
}
.markdown-editor {
  height: 100%;
  margin-top: 20px;
}
.button-part {
  margin-top: 20px;
}
</style>
