class UserModel {
  constructor(user) {
    this.id = user.id
    this.name = user.name
    this.like = 0
    this.veryLike = 0
  }
  toState() {
    let object = {}
    Object.getOwnPropertyNames(this).forEach((key) => {
      object[key] = this[key]
    })
    return object
  }
  addLike(count) {
    this.like += count
  }
  addVeryLike(count) {
    this.veryLike += count
  }
}

export default UserModel
