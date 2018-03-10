<template>
  <div id="editor">
    <h1>Add Post</h1>
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
      <mavon-editor class="markdown-editor" v-model="content" ref=md @imgAdd="$imgAdd"></mavon-editor>
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
  components: {
    mavonEditor
  },
  methods: {
    async submit () {
      try {
        const response = await postService.addPost({
          author: this.$store.state.user.id,
          token: this.$store.state.token,
          title: this.title,
          content: this.content
        })
        this.$store.dispatch('addSuccess', response.data.info)
        this.$router.push({name: 'Post', params: {id: response.data.post.id}})
      } catch (err) {
        this.$store.dispatch('addError', err.response.data.error)
      }
    },
    async $imgAdd (pos, $file) {
      var formData = new FormData()
      formData.append('username', this.$store.state.user.username)
      formData.append('image', $file)
      console.log(formData)
      var response = await postService.uploadImg(formData)
      this.$refs.md.$img2Url(pos, 'http://localhost:8081/' + response.data.url)
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
