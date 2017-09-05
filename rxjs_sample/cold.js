const Rx = require('rxjs/Rx')

const timer$ = Rx.Observable
  .interval(1000)
  .do((x) => { console.log("timer$: " + x)})

timer$.subscribe((x) => {
  console.log("Subscriber A: " + x)
})

timer$.subscribe((x) => {
  console.log("Subscriber B: " + x)
})

// 実行結果
// timer$: 0
// Subscriber A: 0
// timer$: 0
// Subscriber B: 0
// timer$: 1
// Subscriber A: 1
// timer$: 1
// Subscriber B: 1
// ...
