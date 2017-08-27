<template>
  <div id="ServerState">
    <button v-on:click="toggleServerStatus()">toggle server state</button>
    <div>status: {{status}}</div>
    <div>{{stateJson}}</div>
  </div>
</template>

<script>
// このコンポーネントはサーバー状態をデバッグ的に見るだけなのでApiClientは使わずに直接FakeServerを使う
import fakeServer from '../fake_server'
import dispatcher from '../dispatcher'

export default {
  name: 'ServerState',
  data () {
    return {
      state: {}
    }
  },
  computed: {
    stateJson: function() {
      return JSON.stringify(this.$data.state)
    },
    status: function() {
      return (this.$data.state.active) ? 'active' : 'deactive'
    }
  },
  mounted: function() {
    dispatcher.on('UPDATE_SERVER_STATE', () => {
      this.$data.state = Object.assign({}, fakeServer)
    })
    this.$data.state = Object.assign({}, fakeServer)
  },
  methods: {
    toggleServerStatus: function() {
      fakeServer.toggleStatus()
    }
  }
}
</script>

<style lang="scss">
</style>
