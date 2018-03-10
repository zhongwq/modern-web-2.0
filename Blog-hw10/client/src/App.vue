<template>
  <div id="app">
    <v-app>
      <page-header/>
      <div class="infoShower">
        <transition-group name="slide">
          <info-alert v-for="(error, index) in $store.state.error" :content="error" :type="'error'" :key="index"/>
          <info-alert v-for="(success, index) in $store.state.success" :content="success" :type="'success'" :key="index"/>
        </transition-group>
      </div>
      <main>
        <router-view></router-view>
      </main>
    </v-app>
  </div>
</template>

<script>
import PageHeader from '@/components/Header.vue'
import InfoAlert from '@/components/InfoAlert.vue'

export default {
  name: 'App',
  components: {
    PageHeader,
    InfoAlert
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 64px;
}
.input-group--text-field input {
  border-bottom: 1px solid gray;
}
main {
  padding-top: 20px;
  margin: auto;
  width: 1116px;
}
.toolbar__title {
  color: white;
}
.btn__content {
  color: white;
}
.infoShower {
  width: 250px;
  top: 80px;
  right: 10px;
  position: fixed;
  z-index: 999;
}
.slide-enter-active,.slide-leave-active {
  transition: all 0.5s;
}
.slide-enter, .slide-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
