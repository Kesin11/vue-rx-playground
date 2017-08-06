// FluxでいうところのAction

import Rx from 'rxjs/Rx'
import dispatcher from './dispatcher'

export const likeObservable = Rx.Observable.fromEvent(dispatcher, 'click_like')
  .map(payload => {
    const like = payload.user.like + payload.count
    return Object.assign({}, payload.user, { like })
  })

export const veryLikeObservable = Rx.Observable.fromEvent(dispatcher, 'click_like')
  .bufferTime(350)
  .filter((arr) => arr.length > 1)
  .map((arr) => arr[0] )
  .map(payload => {
    const very_like = payload.user.very_like + payload.count
    return Object.assign({}, payload.user, { very_like })
  })
