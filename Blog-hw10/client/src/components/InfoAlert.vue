<template>
  <div class="alert-div" :class="{'error-div': errorInfo, 'success-div': successInfo}">
    <div class="msg">
      {{content}}
    </div>
    <v-btn flat icon class="close" @click="remove">
      <v-icon :color="alertColor">fa-times</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    content: String
  },
  watch: {
    '$route': 'remove'
  },
  computed: {
    errorInfo () {
      return this.type === 'error'
    },
    successInfo () {
      return this.type === 'success'
    },
    alertColor () {
      if (this.type === 'error') {
        return 'error'
      } else {
        return 'success'
      }
    }
  },
  methods: {
    remove () {
      if (this.type === 'error') {
        this.$store.dispatch('removeError', this.content)
      } else {
        this.$store.dispatch('removeSuccess', this.content)
      }
    }
  }
}
</script>

<style scoped>
.alert-div {
  min-height: 80px;
  padding: 20px;
  font-size: 18px;
  margin-bottom: 10px;
  border-radius: 4px;
}
.error-div {
  color: #86181d;
  background-color: #ffdce0;
  border: 1px solid rgba(27,31,35,0.15);
}
.success-div {
  color: #3c763d;
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
}
.msg {
  width: 85%;
  text-align: center;
}
.close {
  float: right;
  position: relative;
  top: -30px;
  left: 20px;
  cursor: pointer;
  user-select: none;
}
.close:hover {
  color: black;
  transition: all 0.5s;
}
</style>
