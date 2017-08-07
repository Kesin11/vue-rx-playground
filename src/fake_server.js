import Rx from 'rxjs/Rx'

class FakeServer {
  constructor(initUsers) {
    this.users = initUsers
    this.seq_id = initUsers.length + 1
  }
  // 初期データ用
  getUsersSync () {
    return Object.assign({}, this.users)
  }
  getUsers () {
    return Rx.Observable.of(this.users)
      .delay(300)
      .map(users => Object.assign({}, users))
      .toPromise()
  }
  addUser() {
    const user = { id: this.seq_id, name: '', like: 0, very_like: 0 }
    this.users.push(user)
    this.seq_id += 1

    return Rx.Observable.of(user)
      .delay(800)
      .toPromise()
  }
}

const initUsers = [
  { id: 1, name: 'Ken',   like: 0, very_like: 0 },
  { id: 2, name: 'Alice', like: 0, very_like: 0 },
  { id: 3, name: 'Van',   like: 0, very_like: 0 },
]

export default new FakeServer(initUsers)
