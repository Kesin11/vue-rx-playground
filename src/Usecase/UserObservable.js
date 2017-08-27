// Userに関するusecase
// FluxではActionに相当する

import Rx from 'rxjs/Rx'
import dispatcher from '../dispatcher'
import ApiClient from '../Infrastructure/ApiClient'
import usersStore from '../Store/UsersStore'
import notificationStore from '../Store/NotificationStore'

const client = new ApiClient()

// Observableはsubscribeされた数だけストリームを複製するような仕組みになっている(cold)
// share()することでsubscribeに関係なくストリームが1つだけ生成され、それぞれのsubscribeはその下にぶら下がるようになる
// https://wilfrem.github.io/learn_rx/cold_hot.html
// userの状態を更新するストリームが複数生成されると複数回実行されてしまうことになるので.share()しておく
export const addLikeObservable = Rx.Observable.fromEvent(dispatcher, 'click_like')
  .share()

addLikeObservable.subscribe(payload => {
    usersStore.addLike(payload.user.id, payload.count)
})

export const addVeryLikeObservable = Rx.Observable.fromEvent(dispatcher, 'click_like')
  .bufferTime(350)
  .filter((arr) => arr.length > 1)
  .map((arr) => arr[0] )
  .share()

addVeryLikeObservable.subscribe(payload => {
    usersStore.addVeryLike(payload.user.id, payload.count)
  })

// like, veryLikeの後に自動でサーバーに同期
export const saveLikeObservable = Rx.Observable.merge(addLikeObservable, addVeryLikeObservable)
  .debounceTime(1000)
  .share()

saveLikeObservable.subscribe(() => {
  dispatcher.emit('save_users')
})

// サーバーからユーザー情報を取得
export const getUsersObservable = Rx.Observable.fromEvent(dispatcher, 'get_users')
  // flatMapは複数のobservableをマージしたものを返す
  // fromPromise()でObservableを返しているので、元々のfromEvent()のものと合流させるためにflatMap()を使う
  .flatMap(() => {
    return Rx.Observable.fromPromise(client.getUsers())
  })

getUsersObservable.subscribe(users => {
  usersStore.reset(users)
})

// ユーザーの追加リクエストを送信
export const addUserObservable = Rx.Observable.fromEvent(dispatcher, 'add_user')
  .do(() => {
    notificationStore.setInfo('loading...')
  })
  .flatMap(() => {
    return Rx.Observable.fromPromise(client.addUser())
  })
  .share()

addUserObservable.subscribe((userState) => {
    usersStore.addUser(userState)
    notificationStore.setSuccess('add user finish!')
  })

// ローカルの状態をサーバーに同期
// エラーハンドリングのために複雑になっている
// 普通にObservableがエラーになるとそのObservableはクローズしてしまい、新しい入力が来ても反応しなくなってしまう
// それを回避するため、switchMap()の中でエラーになってもよい別のObservableを作り、
// 別のObservableでcatch()してエラーハンドリングすることで本流にエラーを流さない
// 本流はエラーにならないのでsubscribe()では普通のエラーハンドリングができないため独自にエラー判定が必要になる
// switchMapの挙動は以下が分かりやすかった
// http://qiita.com/ovrmrw/items/b45d7bf29c8d29415bd7
export const saveUsersObservable = Rx.Observable.fromEvent(dispatcher, 'save_users')
  .do(() => {
    notificationStore.setInfo('loading...')
  })
  .switchMap((event) => {
    return Rx.Observable.of(event)
      .flatMap(() => {
        const usersState = usersStore.getState()
        return Rx.Observable.fromPromise(client.saveUsers(usersState))
      })
      .catch((err) => {
        return Rx.Observable.of(err)
      })
  })
  .share()

saveUsersObservable.subscribe((payload) => {
  if (payload instanceof Error) {
    notificationStore.setError(payload.message)
  } else {
    notificationStore.setSuccess('save users finished!')
  }
})
