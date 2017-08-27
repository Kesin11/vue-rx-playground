import Vue from 'vue'
import App from './Component/App.vue'
// どこかでimportしないとobservableが有効にならないのでしておく
import _UserObservable from './Usecase/UserObservable'

new Vue({
  el: '#app',
  render: h => h(App)
})
