// UserModelを集約するStore
import dispatcher from '../dispatcher'

class UsersStore {
  constructor(users) {
    this.users = users || []
    dispatcher.emit('UPDATE_USERS_STORE')
  }
  getState () {
    // return this.users.map((user) => user.toJSON())
    return this.users.map((user) => user)
  }
  reset (users) {
    this.users = users
    dispatcher.emit('UPDATE_USERS_STORE')
  }
  add (user) {
    this.users.push(user)
    dispatcher.emit('UPDATE_USERS_STORE')
  }
}

// singleton
export default new UsersStore()
