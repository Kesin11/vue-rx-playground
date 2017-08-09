<template>
  <div id="app">
    <ul>
      <li v-for="user in users">
        <div>{{ user.name }}</div>
        <div>Like: {{ user.like }}</div>
        <div>Very like: {{ user.very_like }}</div>
        <button v-on:click="countLike(user)">いいね</button>
      </li>
    </ul>
    <div>{{message}}</div>
    <button v-on:click="addUser()">Add user</button>
    <button v-on:click="cancelAddUser()">Cancel add user</button>
    <div>stoppingAddUser: {{stoppingAddUser}}</div>
  </div>
</template>

<script>
import dispatcher from './dispatcher'
import fakeServer from './fake_server'
import {
  likeObservable,
  veryLikeObservable,
  addUserObservable,
} from './observable'

export default {
  name: 'app',
  data () {
    return {
      users: [],
      count: 0,
      message: '',
      stoppingAddUser: false,
    }
  },
  created: function() {
    // 初期データをロード（debugなので同期的に取る）
    this.$data.users = fakeServer.getUsersSync()
  },
  mounted: function() {
    likeObservable.subscribe( user => {
      const user_id = user.id
      const i = this.$data.users.findIndex((user) => user.id == user_id)
      Object.assign(this.$data.users[i], user)
    })
    veryLikeObservable.subscribe( user => {
      const user_id = user.id
      const i = this.$data.users.findIndex((user) => user.id == user_id)
      Object.assign(this.$data.users[i], user)
    })
    addUserObservable
    .filter( () => ! this.$data.stoppingAddUser )
    .subscribe( user => {
      // 謎だがthis.$data.usersに直接pushできなかったので別Objectを作ってから再代入
      const users = Object.assign([], this.$data.users)
      users.push(user)
      this.$data.users = users
      this.$data.message = 'finish!'
    })
  },
  methods: {
    countLike: function(user) {
      dispatcher.emit('click_like', { user: user, count: 10})
    },
    addUser: function() {
      dispatcher.emit('add_user')
      this.$data.stoppingAddUser = false
      this.$data.message = 'loading...'
    },
    cancelAddUser: function() {
      dispatcher.emit('cancel_add_user')
      this.$data.stoppingAddUser = true
      this.$data.message = 'cancel!'
    },
    toggleStoppingAddUser: function() {
      this.$data.stoppingAddUser = !this.$data.stoppingAddUser
    }
  }
}
</script>

<style lang="scss">
</style>
