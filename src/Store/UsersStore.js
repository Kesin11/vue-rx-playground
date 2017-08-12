// UserModelを集約するStore
import dispatcher from '../dispatcher'
import UserModel from '../Domain/UserModel'

class UsersStore {
  constructor(users) {
    this.users = users || []
    dispatcher.emit('UPDATE_USERS_STORE')
  }
  getState () {
    return this.users.map((user) => user.toState())
  }
  _emitUpdate() {
    dispatcher.emit('UPDATE_USERS_STORE')
  }
  reset (userStates) {
    this.users = userStates.map((userState) => new UserModel(userState))
    this._emitUpdate()
  }
  addUser (userState) {
    const user = new UserModel(userState)
    this.users.push(user)
    this._emitUpdate()
  }
  findUser(user_id) {
    return this.users.find( (user) => user.id === user_id )
  }
  addLike(user_id, count) {
    const user = this.findUser(user_id)
    user.addLike(count)
    this._emitUpdate()
  }
  addVeryLike(user_id, count) {
    const user = this.findUser(user_id)
    user.addVeryLike(count)
    this._emitUpdate()
  }
}

// singleton
export default new UsersStore()
