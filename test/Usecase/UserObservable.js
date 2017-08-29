import test from 'ava'
import { getUsersObservable } from '../../src/Usecase/UserObservable'
import fakeServer from '../../src/FakeServer'
import dispatcher from '../../src/dispatcher'
import usersStore from '../../src/Store/UsersStore'

const initUsers = [
  { id: 1, name: 'foo', like: 0, veryLike: 0 }
]

// 本来であればusersStoreなどはインスタンスをUsecaseに渡すほうがテストもしやすい設計だが、
// 今回はそのような実装になっていないのでbeforeEachで初期化する
test.beforeEach(() => {
  fakeServer.init(initUsers)
  usersStore.reset(initUsers)
});

// 全て非同期でdispatcher, fakeServer, usersStoreが共通なので別のテストケースが影響を及ぼしてしまう
// serialで直列に実行することで安全になる
test.serial('getUsersObservable get_users', t => {
  dispatcher.emit('get_users')

  return new Promise((resolve) => {
    getUsersObservable.subscribe((users) => {
      t.deepEqual(initUsers, users)

      resolve()
    })
  })
})

test.serial('getUsersObservable get_users with fakeServer is deactive', t => {
  fakeServer.active = false
  dispatcher.emit('get_users')

  return new Promise((resolve) => {
    getUsersObservable.subscribe((payload) => {
      t.true(payload instanceof Error)

      resolve()
    })
  })
})

test.serial.cb('UserStore get_users', t => {
  dispatcher.on('UPDATE_USERS_STORE', () => {
    const state = usersStore.getState()
    t.deepEqual(state, initUsers)

    t.end()
  })

  dispatcher.emit('get_users')
})

test.serial.cb('UserStore click_like', t => {
  const count = 10

  dispatcher.on('UPDATE_USERS_STORE', () => {
    const state = usersStore.getState()
    t.is(state[0].like, initUsers[0].like + count)

    t.end()
  })

  dispatcher.emit('click_like', { user: initUsers[0], count: 10 })
})

test.serial.cb('UserStore add_user', t => {
  dispatcher.on(('UPDATE_USERS_STORE'), () => {
    const expectLength = initUsers.length + 1

    const state = usersStore.getState()
    t.is(state.length, expectLength)

    t.end()
  })

  dispatcher.emit('add_user')
})
