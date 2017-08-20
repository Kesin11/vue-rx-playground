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

export const addUserObservable = Rx.Observable.fromEvent(dispatcher, 'add_user')
  .flatMap(() => {
    return Rx.Observable.fromPromise(client.addUser())
  })

addUserObservable.subscribe((userState) => {
    usersStore.addUser(userState)
  })