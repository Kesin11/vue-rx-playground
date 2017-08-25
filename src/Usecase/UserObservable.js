// Userに関するusecase
// FluxではActionに相当する

import Rx from 'rxjs/Rx'
import dispatcher from '../dispatcher'
import ApiClient from '../Infrastructure/ApiClient'
import usersStore from '../Store/UsersStore'

const client = new ApiClient()

export const addLikeObservable = Rx.Observable.fromEvent(dispatcher, 'click_like')

addLikeObservable.subscribe(payload => {
    usersStore.addLike(payload.user.id, payload.count)
})

export const addVeryLikeObservable = Rx.Observable.fromEvent(dispatcher, 'click_like')
  .bufferTime(350)
  .filter((arr) => arr.length > 1)
  .map((arr) => arr[0] )

addVeryLikeObservable.subscribe(payload => {
    usersStore.addVeryLike(payload.user.id, payload.count)
  })

export const getUsersObservable = Rx.Observable.fromEvent(dispatcher, 'get_users')
  .flatMap(() => {
    return Rx.Observable.fromPromise(client.getUsers())
  })

getUsersObservable.subscribe(users => {
  usersStore.reset(users)
})

// Observableはsubscribeされた数だけストリームを複製するような仕組みになっている(cold)
// share()することでsubscribeに関係なくストリームが1つだけ生成され、それぞれのsubscribeはその下にぶら下がるようになる
// https://wilfrem.github.io/learn_rx/cold_hot.html
// addUserはストリームが複数生成されると複数回実行されてしまうことになるので.share()しておく
export const addUserObservable = Rx.Observable.fromEvent(dispatcher, 'add_user')
  .flatMap(() => {
    return Rx.Observable.fromPromise(client.addUser())
  })
  .share()

addUserObservable.subscribe((userState) => {
    usersStore.addUser(userState)
  })

export const saveUsersObservable = Rx.Observable.fromEvent(dispatcher, 'save_users')
  .flatMap(() => {
    const usersState = usersStore.getState()
    return Rx.Observable.fromPromise(client.saveUsers(usersState))
  })
  .share()
