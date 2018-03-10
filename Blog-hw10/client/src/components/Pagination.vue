<template>
  <div id="pagination" class="text-xs-center">
    <v-pagination :length="maxPage" v-model="page" :total-visible="7"></v-pagination>
  </div>
</template>

<script>
export default {
  props: {
    maxPage: Number
  },
  data () {
    return {
      page: 1
    }
  },
  created () {
    this.page = parseInt(this.$route.query.page) || 1
  },
  watch: {
    'page': 'updateQuery'
  },
  methods: {
    updateQuery () {
      this.$router.push({name: 'Posts', query: {keyword: this.$route.query.keyword, page: this.page, mode: this.$route.query.mode}})
    }
  }
}
</script>

<style scoped>
#pagination {
  margin-top: 10px;
}
</style>
