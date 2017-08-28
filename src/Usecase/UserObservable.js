// Userに関するusecase
// FluxではActionに相当する

// TODO: インスタンス化できないとテストするためにモックしなきゃいけなかったりするので、跡で直す

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
  // mergeMapは複数のobservableをマージしたものを返す
  // mergeMap()はObservable以外にもPromise()などを引数に取れる
  // Observableにエラーが流れると次のイベントが来ても処理が行われなくなるため、
  // Promiseの段階でcatchによるエラーハンドリングをすることで本流のObservableがエラーになることを防ぐ
  .mergeMap(() => {
    return client.getUsers()
      .then((users) => users)
      .catch((err) => err)
  })
  .share()

getUsersObservable.subscribe((payload) => {
  if (payload instanceof Error) {
    notificationStore.setError(payload.message)
  }
  else {
    usersStore.reset(payload)
  }
})

// ユーザーの追加リクエストを送信
export const addUserObservable = Rx.Observable.fromEvent(dispatcher, 'add_user')
  .do(() => {
    notificationStore.setInfo('loading...')
  })
  .mergeMap(() => {
    return client.addUser()
      .then((newUser) => newUser)
      .catch((err) => err )
  })
  .share()

addUserObservable.subscribe((payload) => {
  if (payload instanceof Error) {
    notificationStore.setError(payload.message)
  }
  else {
    usersStore.addUser(payload)
    notificationStore.setSuccess('add user finish!')
  }
})

// ローカルの状態をサーバーに同期
export const saveUsersObservable = Rx.Observable.fromEvent(dispatcher, 'save_users')
  .do(() => {
    notificationStore.setInfo('loading...')
  })
  .mergeMap(() => {
    const usersState = usersStore.getState()
    return client.saveUsers(usersState)
      .catch((err) => err)
  })
  .share()

saveUsersObservable.subscribe((payload) => {
  if (payload instanceof Error) {
    notificationStore.setError(payload.message)
  } else {
    notificationStore.setSuccess('save users finished!')
  }
})
