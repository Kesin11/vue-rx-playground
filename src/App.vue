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

    <br>
    <div>count: {{ count }}</div>
    <button v-on:click="countUp">subscribeCount</button>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx'
const counterSubject = new Rx.Subject()
counterSubject
  .map(value => value + 10)
  .subscribe(value => {
    console.log(value)
  })

// 一度subjectをnewしてからじゃないとsubject.mapできないのがイマイチなので使い方間違えてる気がしないでもないのだが・・・
// Observableは最初に流す値が決まってる類しかなかったので、next()だけで制御するにはこれしか思いつかなかった
const subject = new Rx.Subject()
const likeSubject = subject.map(payload => {
  const like = payload.user.like + payload.count
  return Object.assign({}, payload.user, { like })
})

const veryLikeSubject = subject
  // これが動かないけど、nextがワンショットだからか？
  .buffer(() => subject.debounce(100))
  .map(payload => {
    const very_like = payload.user.very_like + payload.count
    return Object.assign({}, payload.user, { very_like })
  })

export default {
  name: 'app',
  data () {
    return {
      users: [
        { id: 1, name: 'Ken',   like: 0, very_like: 0 },
        { id: 2, name: 'Alice', like: 0, very_like: 0 },
        { id: 3, name: 'Van',   like: 0, very_like: 0 },
      ],
      count: 0,
    }
  },
  mounted: function() {
    counterSubject.subscribe( value => {
      this.$data.count += value
    })
    likeSubject.subscribe( user => {
      const user_id = user.id
      const i = this.$data.users.findIndex((user) => user.id == user_id)
      Object.assign(this.$data.users[i], user)
    })
    veryLikeSubject.subscribe( user => {
      const user_id = user.id
      const i = this.$data.users.findIndex((user) => user.id == user_id)
      Object.assign(this.$data.users[i], user)
    })
  },
  methods: {
    countUp: function() {
      counterSubject.next(1)
    },
    countLike: function(user) {
      likeSubject.next({ user: user, count: 10 })
    }
  }
}
</script>

<style lang="scss">
</style>
