<template>
  <v-flex xs2>
    <v-text-field
      v-model="keyword"
      placeholder="Search"
      ref="searchBar"
      @keyup.esc="resetBar"
      :append-icon="'search'"></v-text-field>
  </v-flex>
</template>

<script>
export default {
  data () {
    return {
      keyword: ''
    }
  },
  watch: {
    'keyword': 'updateQuery'
  },
  created () {
    this.keywords = this.$route.query.keyword || ''
  },
  methods: {
    resetBar () {
      this.keyword = ''
      this.$refs.searchBar.blur()
    },
    updateQuery () {
      if (this.keyword) {
        this.$router.push({name: 'Posts', query: {keyword: this.keyword, page: 1, mode: this.$route.query.mode}})
      } else {
        this.$router.push({name: 'Posts', query: {keyword: null, page: 1, mode: this.$route.query.mode}})
      }
    }
  }
}
</script>

<style>
</style>
