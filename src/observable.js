// FluxでいうところのAction

import Rx from 'rxjs/Rx'
import dispatcher from './dispatcher'

export const counterSubject = new Rx.Subject()
counterSubject
  .map(value => value + 10)
  .subscribe(value => {
    console.log(value)
  })

export const likeObservable = Rx.Observable.fromEvent(dispatcher, 'click_like')
  .map(payload => {
    const like = payload.user.like + payload.count
    return Object.assign({}, payload.user, { like })
  })

const veryLikeObservable = Rx.Observable.fromEvent(dispatcher, 'click_like')
export const debouncedVeryLikeObservable = veryLikeObservable
  .buffer(() => veryLikeObservable.debounce(250)) // TODO: なぜか動かない・・・
  .map(payload => {
    const very_like = payload.user.very_like + payload.count
    return Object.assign({}, payload.user, { very_like })
  })
