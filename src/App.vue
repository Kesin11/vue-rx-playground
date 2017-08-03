<template>
  <div id="app">
    <ul>
      <li v-for="user in users">
        {{ user.name }}
      </li>
    </ul>

    <br>
    <div>count: {{ count }}</div>
    <button v-on:click="countUp">subscribeCount</button>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx'
const subject = new Rx.Subject()
subject
  .map(value => value + 10)
  .subscribe(value => {
    console.log(value)
  })

export default {
  name: 'app',
  data () {
    return {
      users: [
        { id: 1, name: 'Ken'},
        { id: 2, name: 'Alice'},
        { id: 3, name: 'Van'},
      ],
      count: 0,
    }
  },
  mounted: function() {
    subject.subscribe( value => {
      this.$data.count += value
    })
  },
  methods: {
    countUp: function() {
      subject.next(1)
    },
  }
}
</script>

<style lang="scss">
</style>
