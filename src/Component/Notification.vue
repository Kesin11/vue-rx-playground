<template>
  <div>
    {{message}}
  </div>
</template>

<script>
import notificationStore from '../Store/NotificationStore'
import dispatcher from '../dispatcher'

export default {
  data () {
    return {
      message: '',
    }
  },
  mounted: function() {
    // Storeを監視してViewModelを更新
    dispatcher.on('UPDATE_NOTIFICATION_STORE', () => {
      const state = notificationStore.getState()
      this.$data.message = `${state.type}: ${state.message}`
    })
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>
