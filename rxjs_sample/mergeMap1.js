const Rx = require('rxjs/Rx')

function fakeAjax(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 常に成功する場合
      // resolve(x)

      // エラーを返すことがある場合
      if (x === 10) resolve(x)
      return reject(new Error)
    }, 100)
  })
}

// 500ms間隔で0,1,2,3,4までを流す
const observable$ = Rx.Observable.interval(500).take(4)
  .map((x) => x * 10)
  .mergeMap((x) => {
    return fakeAjax(x)
  } )
  // ここで以下のようにcatchしたとしても一度エラーになるとそのObservableには流れなくなってしまう
  // .catch((error) => Rx.Observable.of('error'))

observable$.subscribe(
  (x) => { console.log(x) },
  (error) => { console.log(error)}
)

// 実行結果 常に成功する場合
// 0
// 10
// 20
// 30

// 実行結果 エラーを返すことがある場合
// Error
//     at Timeout.setTimeout [as _onTimeout] (/***/mergeMap.js:11:21)
//     at ontimeout (timers.js:488:11)
//     at tryOnTimeout (timers.js:323:5)
//     at Timer.listOnTimeout (timers.js:283:5)
