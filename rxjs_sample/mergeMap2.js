const Rx = require('rxjs/Rx')

function fakeAjax(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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
      .catch((error) => error)
  } )

observable$.subscribe(
  (x) => {
    if (x instanceof Error) {
      console.log(x)
    }
    else {
      console.log('success: ' + x)
    }
  }
)

// 実行結果
// Error
//     at Timeout.setTimeout [as _onTimeout] (/***/mergeMap2.js:8:21)
//     ...省略
// success: 10
// Error
//     at Timeout.setTimeout [as _onTimeout] (/***/mergeMap2.js:8:21)
//     ...省略
// Error
//     at Timeout.setTimeout [as _onTimeout] (/***/mergeMap2.js:8:21)
//     ...省略
