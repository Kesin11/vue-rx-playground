<template>
  <div id="ServerState">
    <button v-on:click="fetchState()">fetchState</button>
    <div>{{stateJson}}</div>
  </div>
</template>

<script>
// このコンポーネントはサーバー状態をデバッグ的に見るだけなのでApiClientは使わずに直接FakeServerを使う
import fakeServer from './fake_server'
import dispatcher from './dispatcher'

export default {
  name: 'ServerState',
  data () {
    return {
      stateJson: {}
    }
  },
  mounted: function() {
    dispatcher.on('UPDATE_SERVER_STATE', () => {
      this.$data.stateJson = fakeServer.getJSON()
    })
    this.$data.stateJson = fakeServer.getJSON()
  },
  methods: {
    fetchState: function() {
      this.$data.stateJson = fakeServer.getJSON()
    }
  }
}
</script>

<style lang="scss">
</style>
