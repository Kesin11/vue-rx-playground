class UserModel {
  constructor(user) {
    this.id = user.id
    this.name = user.name
    this.like = user.like
    this.veryLike = user.veryLike
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
