const Rx = require('rxjs/Rx')

let sum = 0
const observable = Rx.Observable.from([1,2,3])
  .map((x) => x * 10)
  .do((x) => {
    sum += x
    console.log("sum: " + sum)
  })

observable.subscribe((x) => {
  console.log("subscribe: " + x)
})

// 実行結果
//
// sum: 10
// subscribe: 10
// sum: 30
// subscribe: 20
// sum: 60
// subscribe: 30
