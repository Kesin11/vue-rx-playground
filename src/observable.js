// FluxでいうところのAction

import Rx from 'rxjs/Rx'
import dispatcher from './dispatcher'
import fakeServer from './fake_server'
import usersStore from './Store/UsersStore'

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

export const addUserObservable = Rx.Observable.fromEvent(dispatcher, 'add_user')
  .flatMap(() => {
    return Rx.Observable.fromPromise(fakeServer.addUser())
  })

addUserObservable.subscribe((userState) => {
    usersStore.addUser(userState)
  })
