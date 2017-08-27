<template>
  <div id="app">
    <ul>
      <li v-for="user in users">
        <div>{{ user.name }}</div>
        <div>Like: {{ user.like }}</div>
        <div>Very like: {{ user.veryLike }}</div>
        <button v-on:click="countLike(user)">いいね</button>
      </li>
    </ul>
    <Notification></Notification>
    <button v-on:click="addUser()">Add user</button>
    <button v-on:click="getUsers()">Reset state</button>
    <button v-on:click="saveUsers()">Save state</button>
    <ServerState></ServerState>
  </div>
</template>

<script>
import ServerState from './ServerState.vue'
import Notification from './Notification.vue'
import dispatcher from '../dispatcher'
import usersStore from '../Store/UsersStore'

export default {
  name: 'app',
  components: { ServerState, Notification },
  data () {
    return {
      users: [],
      count: 0,
    }
  },
  created: function() {
    // 初期データをロード
    this.getUsers()
  },
  mounted: function() {
    // Storeを監視してViewModelを更新
    dispatcher.on('UPDATE_USERS_STORE', () => {
      this.$data.users = usersStore.getState()
    })
  },
  methods: {
    countLike: function(user) {
      dispatcher.emit('click_like', { user: user, count: 10})
    },
    getUsers: function() {
      dispatcher.emit('get_users')
    },
    addUser: function() {
      dispatcher.emit('add_user')
    },
    saveUsers: function() {
      dispatcher.emit('save_users')
    },
  }
}
</script>

<style lang="scss">
</style>
