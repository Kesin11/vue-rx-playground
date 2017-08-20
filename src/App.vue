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
    <div>{{message}}</div>
    <button v-on:click="addUser()">Add user</button>
    <ServerState></ServerState>
  </div>
</template>

<script>
import ServerState from './ServerState.vue'
import dispatcher from './dispatcher'
import {
  addUserObservable,
} from './Usecase/UserObservable'
import usersStore from './Store/UsersStore'

export default {
  name: 'app',
  components: { ServerState },
  data () {
    return {
      users: [],
      count: 0,
      message: '',
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

    addUserObservable
      .subscribe( () => {
        this.$data.message = 'finish!'
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
      this.$data.message = 'loading...'
    },
  }
}
</script>

<style lang="scss">
</style>
