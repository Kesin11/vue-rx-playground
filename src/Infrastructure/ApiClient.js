// 外部APIとの通信
// ここではfakeServerに対しての疑似通信を行う
import fakeServer from '../fake_server'

export default class ApiClient {
  constructor() {
  }
  getUsers() {
    return fakeServer.getUsers()
  }
  addUser() {
    return fakeServer.addUser()
  }
  saveUsers(usersState) {
    return fakeServer.saveUsers(usersState)
  }
}
