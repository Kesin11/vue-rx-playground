// 今のところNotificationは複雑なドメインモデルを必要としないのでStoreがModelも兼ねる
// 複数の通知やロジック自体が複雑化してきたらNotificationModelを集約するように変える
import dispatcher from '../dispatcher'

const TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error'
}

class NotificationStore {
  constructor() {
    this.message = ''
    this.type = ''
  }
  getState () {
    return Object.assign({}, { message: this.message, type: this.type })
  }
  _emitUpdate() {
    dispatcher.emit('UPDATE_NOTIFICATION_STORE')
  }
  setInfo(message) {
    this.message = message
    this.type = TYPE.INFO
    this._emitUpdate()
  }
  setSuccess(message) {
    this.message = message
    this.type = TYPE.SUCCESS
    this._emitUpdate()
  }
  setError(message) {
    this.message = message
    this.type = TYPE.ERROR
    this._emitUpdate()
  }
}

// singleton
export default new NotificationStore()
